import { Handler } from '@netlify/functions';
import { Credentials } from 'google-auth-library';
import { fetchBackend } from '../backend';

const handler: Handler = async () => {
  const tokensResponse = await fetchBackend('/drive-tokens');
  const tokens: Credentials = (await tokensResponse.json()) as any;

  if (tokens && tokens.access_token) {
    return { body: JSON.stringify({ accessToken: tokens.access_token }), statusCode: 200 };
  }

  return { statusCode: 404, body: 'Not found' };
};

export { handler };
