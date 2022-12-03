import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
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

      const docs = files
        ?.filter((file) => file.mimeType === DOC_MIME_TYPE)
        .map((file) => file.id);

      await Promise.all(
        (docs || []).map((id) => saveFile(id || '', currentFile.path))
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

async function saveFile(fileId: string, path: string[]) {
  const response = await exportFile(fileId);

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
  const serializedHtmlFileName = serializeName(htmlFile.entryName);
  const serializedPageName = serializedHtmlFileName.slice(
    0,
    serializedHtmlFileName.lastIndexOf('.')
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
