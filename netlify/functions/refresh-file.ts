import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
import { drive_v3 } from 'googleapis';
import { savePage } from '../backend';
import { exportFile, listFiles } from '../drive';
import { formatPage, streamToBuffer } from '../format-page';
const PROJECT_ID = 'first-project';
const ROOT_FOLDER_ID = '1aji29iDimzSX33wRNxx1HDJej7ipJ7sS';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const DOC_MIME_TYPE = 'application/vnd.google-apps.document';

const handler: Handler = async () => {
  const seen = new Set();
  try {
    const queue = [{ id: ROOT_FOLDER_ID, path: [] as string[] }];
    while (queue.length) {
      const currentFile = queue.pop();
      if (!currentFile || seen.has(currentFile)) {
        continue;
      }
      console.log(
        'Processing path',
        JSON.stringify({ id: currentFile.id, path: currentFile.path.join('/') })
      );

      const response = await listFiles(`parents in '${currentFile.id}'`);

      const { files } = response.data;

      const folders =
        files?.filter((file) => file.mimeType === FOLDER_MIME_TYPE) || [];

      queue.unshift(
        ...folders.map(({ id, name }) => ({
          id: id || '',
          path: [...currentFile?.path, serializeName(name || '')],
        }))
      );

      const docs = files?.filter((file) => file.mimeType === DOC_MIME_TYPE);

      await Promise.all(
        (docs || []).map((docFile) => saveFile(docFile, currentFile.path))
      );
    }
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
    return {
      statusCode: 404,
      body: 'Doc file did not have ID',
    };
  }

  const response = await exportFile(driveFile.id);

  if (!response.data) {
    return {
      statusCode: 404,
    };
  }

  // Decode the exported zip in memory
  const buf = await streamToBuffer(response.data);
  const zip = new AdmZip(buf);

  // Find all the image entries and the html file
  const images = zip
    .getEntries()
    .filter((entry) => entry.entryName.startsWith('images/'));
  const htmlFile = zip
    .getEntries()
    .find((entry) => entry.entryName.endsWith('.html'));

  if (!htmlFile) {
    return { statusCode: 403, body: 'No html file found' };
  }

  // Serialize the filename so it's consistent between the url and the storage
  const serializedHtmlFileName = serializeName(
    driveFile.name ? driveFile.name + '.html' : htmlFile.name
  );
  const serializedPageName = serializedHtmlFileName.slice(
    0,
    serializedHtmlFileName.lastIndexOf('.')
  );

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
    const filepath = imageEntry.entryName
      .toLowerCase()
      .replace(/\//, `/${serializedPageName}/`);

    imageReplacements[imageEntry.entryName] = filepath;

    const resp = await savePage(
      [PROJECT_ID, ...path, filepath].join('/'),
      imageEntry.getData()
    );

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
    return {
      statusCode: 500,
      body: `Unable to save ${serializedHtmlFileName}`,
    };
  }

  return { statusCode: 201 };
}

function serializeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export { handler };
