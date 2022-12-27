import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
import { drive_v3 } from 'googleapis';
import { fetchBackend, savePage } from '../backend';
import { USER_ID } from '../constants';
import { exportDoc, listFoldersAndDocs } from '../drive';
import { formatPage } from '../format-page';
import { serializeName } from '../naming';

const handler: Handler = async (event) => {
  if (!event.body) {
    throw new Error('No project ID provided');
  }
  const parsedBody = JSON.parse(event.body);
  const projectId: string = parsedBody.projectId;
  if (!projectId) {
    throw new Error('No project ID provided');
  }

  const projectsResponse = await fetchBackend(`/projects?userId=${USER_ID}`);
  const projects: any = await projectsResponse.json();
  const project = projects?.find((project) => project.projectId === projectId);
  if (!project) {
    return { statusCode: 404, body: 'Project not found' };
  }

  try {
    const seen = new Set();
    const linkReplacements: Record<string, string> = {};
    const queue = [{ rootFolderId: project.rootFileId, path: [projectId] }];
    const docsToSave: { driveFileId: string; driveFileName: string; path: string[] }[] = [];
    while (queue.length) {
      const currentFile = queue.pop();
      if (!currentFile || seen.has(currentFile)) {
        continue;
      }
      console.log(
        'Processing path',
        JSON.stringify({ rootFolderId: currentFile.rootFolderId, path: currentFile.path.join('/') })
      );

      const { folders, docs } = await listFoldersAndDocs(currentFile.rootFolderId);
      console.log('docs', docs);

      const folderWithoutNameOrId = folders.find((folder) => !folder.id || !folder.name);
      if (folderWithoutNameOrId) {
        throw new Error(
          `Encountered drive folder without an id or name: ${JSON.stringify(folderWithoutNameOrId)}`
        );
      }

      queue.unshift(
        ...folders.map(({ id, name }) => ({
          rootFolderId: id || '',
          path: [...currentFile?.path, serializeName(name || '')],
        }))
      );

      const docWithoutNameOrId = docs.find((doc) => !doc.id || !doc.name);
      if (docWithoutNameOrId) {
        throw new Error(
          `Encountered drive doc without an id or name: ${JSON.stringify(docWithoutNameOrId)}`
        );
      }

      for (const doc of docs) {
        docsToSave.push({
          driveFileId: doc.id || '',
          driveFileName: doc.name || '',
          path: currentFile.path,
        });
        const { serializedHtmlFileName } = serializePageNaming(doc.name || '');
        const fullHtmlFilePath = [...currentFile.path, serializedHtmlFileName].join('/');
        linkReplacements[doc.id || ''] = ['', 'pages', fullHtmlFilePath].join('/');
      }

      // Single page sites only have one file so listFoldersAndDocs returns nothing
      if (docs.length === 0 && folders.length === 0) {
        docsToSave.push({
          driveFileId: project.rootFileId,
          driveFileName: 'index',
          path: currentFile.path,
        });
      }
    }

    const savedFiles = await Promise.all(
      docsToSave.map(({ driveFileId, driveFileName, path }) =>
        saveFile(driveFileId, driveFileName, path, linkReplacements)
      )
    );

    console.log('savedFiles', savedFiles);
    const updatedProjects = projects.map((project) =>
      project.projectId === projectId ? { ...project, rootFile: savedFiles[0] } : project
    );
    console.log('updatedProjects', updatedProjects);
    const requestBody = JSON.stringify(updatedProjects);
    const response = await fetchBackend(`/projects?userId=${USER_ID}`, {
      method: 'POST',
      body: requestBody,
    });

    if (!response.ok) {
      return { statusCode: 500, body: 'Unable to save rootFile' };
    }

    return { statusCode: 201 };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: e.toString(),
    };
  }
};

async function saveFile(
  driveFileId: string,
  driveFileName: string,
  path: string[],
  linkReplacements: Record<string, string>
) {
  if (!driveFileId) {
    throw new Error('Doc file does not have an ID');
  }

  const zip = await exportDoc(driveFileId);

  // Find all the image entries and the html file
  const images = zip.getEntries().filter((entry) => entry.entryName.startsWith('images/'));
  const htmlFile = zip.getEntries().find((entry) => entry.entryName.endsWith('.html'));

  if (!htmlFile) {
    return { statusCode: 403, body: 'No html file found' };
  }

  // Serialize the filename so it's consistent between the url and the storage
  const { serializedHtmlFileName, serializedPageName } = serializePageNaming(driveFileName);

  console.log(
    'Saving doc',
    JSON.stringify({
      id: driveFileId,
      path: path.join('/'),
      serializedHtmlFileName,
      images: images.length,
    })
  );

  // Put images in subfolders and store them
  const imageReplacements: Record<string, string> = {};
  for (const imageEntry of images) {
    const filepath = imageEntry.entryName.toLowerCase().replace(/\//, `/${serializedPageName}/`);

    imageReplacements[imageEntry.entryName] = filepath;

    const resp = await savePage([...path, filepath].join('/'), imageEntry.getData());

    if (!resp.ok) {
      throw new Error(`Unable to save ${filepath}: ${resp.statusText}`);
    }
  }

  // Format and store the HTML document for the page
  const fullHtmlFilePath = [...path, serializedHtmlFileName].join('/');
  const formattedPage = await formatPage(htmlFile.getData(), imageReplacements, linkReplacements);
  const resp = await savePage(fullHtmlFilePath, formattedPage);

  if (!resp.ok) {
    throw new Error(`Page save error: ${resp.statusText}`);
  }

  return fullHtmlFilePath;
}

function serializePageNaming(driveFileName: string) {
  const serializedHtmlFileName = serializeName(driveFileName + '.html');
  const serializedPageName = serializedHtmlFileName.slice(
    0,
    serializedHtmlFileName.lastIndexOf('.')
  );

  return { serializedHtmlFileName, serializedPageName };
}

export { handler };
