import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
import { createOAuth2Client } from '../drive';

const handler: Handler = async (event, context) => {
  const code: string | undefined = event.queryStringParameters?.code;
  const state: string | undefined = event.queryStringParameters?.state;
  if (!code || !state) {
    return { statusCode: 403, body: 'Invalid auth URL provided' };
  }

  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = createOAuth2Client();

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Store the tokens in the backend
  await fetchBackend(`/drive-tokens?userId=${state}`, {
    method: 'POST',
    body: JSON.stringify(tokens),
  });

  return {
    statusCode: 201,
    body: 'Successfully connected your Google Drive account. You can close this page',
  };
};

export { handler };
