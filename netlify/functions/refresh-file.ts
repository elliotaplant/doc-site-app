import { Handler } from '@netlify/functions';
import AdmZip, { IZipEntry } from 'adm-zip';
import { drive_v3 } from 'googleapis';
import { savePage } from '../backend';
import { exportDoc, listFoldersAndDocs } from '../drive';
import { formatPage } from '../format-page';
import { serializeName } from '../naming';
const PROJECT_ID = 'first-project';
const ROOT_FOLDER_ID = '1aji29iDimzSX33wRNxx1HDJej7ipJ7sS';

const handler: Handler = async () => {
  try {
    const seen = new Set();
    const queue = [{ id: ROOT_FOLDER_ID, path: [] as string[] }];
    const docsToSave: { docFile: drive_v3.Schema$File; path: string[] }[] = [];
    while (queue.length) {
      const currentFile = queue.pop();
      if (!currentFile || seen.has(currentFile)) {
        continue;
      }
      console.log(
        'Processing path',
        JSON.stringify({ id: currentFile.id, path: currentFile.path.join('/') })
      );

      const { folders, docs } = await listFoldersAndDocs(currentFile.id);

      queue.unshift(
        ...folders.map(({ id, name }) => ({
          id: id || '',
          path: [...currentFile?.path, serializeName(name || '')],
        }))
      );

      docsToSave.push(...docs.map((docFile) => ({ docFile, path: currentFile.path })));
    }
    await Promise.all(docsToSave.map(({ docFile, path }) => saveFile(docFile, path)));
    return { statusCode: 201 };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.toString(),
    };
  }
};

async function saveFile(driveFile: drive_v3.Schema$File, path: string[]) {
  if (!driveFile.id) {
    throw new Error('Doc file does not have an ID');
  }

  const zip = await exportDoc(driveFile.id);

  // Find all the image entries and the html file
  const images = zip.getEntries().filter((entry) => entry.entryName.startsWith('images/'));
  const htmlFile = zip.getEntries().find((entry) => entry.entryName.endsWith('.html'));

  if (!htmlFile) {
    return { statusCode: 403, body: 'No html file found' };
  }

  // Serialize the filename so it's consistent between the url and the storage
  const { serializedHtmlFileName, serializedPageName } = serializePageNaming(driveFile, htmlFile);

  console.log(
    'Saving doc',
    JSON.stringify({
      id: driveFile.id,
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

    const resp = await savePage([PROJECT_ID, ...path, filepath].join('/'), imageEntry.getData());

    if (!resp.ok) {
      return { statusCode: 500, body: `Unable to save ${filepath}` };
    }
  }

  // Format and store the HTML document for the page
  const formattedPage = await formatPage(htmlFile.getData(), imageReplacements);
  const resp = await savePage(
    [PROJECT_ID, ...path, serializedHtmlFileName].join('/'),
    formattedPage
  );

  if (!resp.ok) {
    throw new Error(`Page save error: ${resp.statusText}`);
  }

  return { statusCode: 201 };
}

function serializePageNaming(driveFile: drive_v3.Schema$File, htmlFile: AdmZip.IZipEntry) {
  const serializedHtmlFileName = serializeName(
    driveFile.name ? driveFile.name + '.html' : htmlFile.name
  );
  const serializedPageName = serializedHtmlFileName.slice(
    0,
    serializedHtmlFileName.lastIndexOf('.')
  );

  return { serializedHtmlFileName, serializedPageName };
}

export { handler };
