import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
import { savePage } from '../backend';
import { exportFile } from '../drive';
import { formatPage, streamToBuffer } from '../format-page';
const PROJECT_ID = 'first-project';

const handler: Handler = async () => {
  const response = await exportFile(
    '1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y'
  );

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
  const serializedHtmlFileName = htmlFile.entryName
    .toLowerCase()
    .replace(/\s+/g, '-');
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
      `${PROJECT_ID}/${filepath}`,
      imageEntry.getData()
    );

    if (!resp.ok) {
      return { statusCode: 500, body: `Unable to save ${filepath}` };
    }
  }

  // Format and store the HTML document for the page
  const formattedPage = await formatPage(htmlFile.getData(), imageReplacements);
  const resp = await savePage(
    `${PROJECT_ID}/${serializedHtmlFileName}`,
    formattedPage
  );

  if (!resp.ok) {
    return {
      statusCode: 500,
      body: `Unable to save ${serializedHtmlFileName}`,
    };
  }

  return { statusCode: 201 };
};

export { handler };
