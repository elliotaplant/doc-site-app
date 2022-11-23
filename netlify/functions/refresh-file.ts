import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
import { exportFile } from '../drive';

const handler: Handler = async () => {
  const response = await exportFile(
    '1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y'
  );

  if (!response.data) {
    return {
      statusCode: 404,
    };
  }

  const resp = await fetchBackend('/pages', {
    method: 'POST',
    headers: { 'content-type': 'text/html' },
    body: response.data,
  });

  console.log('resp.', resp.status);

  return { statusCode: 201 };
};

export { handler };
