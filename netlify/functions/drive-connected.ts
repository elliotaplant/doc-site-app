import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
import { Credentials } from 'google-auth-library';

const handler: Handler = async (event, context) => {
  const sub = context.clientContext?.user?.sub;
  if (!sub) {
    return { statusCode: 403, body: 'Unauthorized' };
  }

  const tokensResponse = await fetchBackend(`/drive-tokens?userId=${sub}`);
  const tokens: Credentials = (await tokensResponse.json()) as any;

  return {
    statusCode: 200,
    body: JSON.stringify({ driveConnected: Boolean(tokens.access_token) }),
  };
};

export { handler };
