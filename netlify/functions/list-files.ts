import { Handler } from '@netlify/functions';
import { listFiles } from '../drive';

const handler: Handler = async () => {
  const response = await listFiles(
    "parents in '1aji29iDimzSX33wRNxx1HDJej7ipJ7sS'"
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
