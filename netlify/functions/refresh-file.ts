import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
import { fetchBackend } from '../backend';
import { exportFile } from '../drive';
import { formatPage, streamToBuffer } from '../format-page';

const handler: Handler = async () => {
  const response = await exportFile(
    '1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y'
  );

  if (!response.data) {
    return {
      statusCode: 404,
    };
  }
  const buf = await streamToBuffer(response.data);
  const zip = new AdmZip(buf);
  for (const zipEntry of zip.getEntries()) {
    console.log(zipEntry.toString()); // outputs zip entries information
    console.log(zipEntry.getData().toString('utf8'));
  }

  if (Math.random() < 2) {
    return { statusCode: 200 };
  }

  const formattedPage = await formatPage(response.data);

  const resp = await fetchBackend('/pages', {
    method: 'POST',
    headers: { 'content-type': 'text/html' },
    body: formattedPage,
  });

  console.log('resp.', resp.status);

  return { statusCode: 201 };
};

export { handler };
