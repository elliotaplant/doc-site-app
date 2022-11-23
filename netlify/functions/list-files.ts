import { Handler } from '@netlify/functions';
import { listFiles } from '../drive';

const handler: Handler = async () => {
  const response = await listFiles(
    "parents in 'root' and mimeType = 'application/vnd.google-apps.folder'"
  );

  const files = response.data.files;
  if (files?.length) {
    return {
      body: JSON.stringify(response.data),
      statusCode: 200,
    };
  }

  return { statusCode: 400 };
};

export { handler };
