import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';

const handler: Handler = async () => {
  const tokens = await fetchBackend('/drive-tokens');
  console.log('tokens', await tokens.json());

  return { statusCode: 200 };
};

export { handler };
