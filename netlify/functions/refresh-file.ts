import { Handler } from '@netlify/functions';
import AdmZip from 'adm-zip';
import { fetchBackend } from '../backend';
import { exportFile } from '../drive';
import { formatPage } from '../format-page';
import { toBuffer } from '../buffer';

const handler: Handler = async () => {
  const response = await exportFile(
    '1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y'
  );

  if (!response.data) {
    return {
      statusCode: 404,
    };
  }
  const buf = await toBuffer(response.data);
  console.log('buf', buf.toString('utf-8'));
  const zip = new AdmZip(buf);
  const zipEntries = zip.getEntries();
  console.log('len:', zipEntries.length);

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
