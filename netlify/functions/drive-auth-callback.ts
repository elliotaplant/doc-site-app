import { Handler } from '@netlify/functions';
import { google } from 'googleapis';
import { fetchBackend } from '../backend';

const handler: Handler = async (event, context) => {
  console.log('event:', event.httpMethod, event.rawUrl);

  const code: string | undefined = event.queryStringParameters?.code;
  if (!code) {
    return {
      statusCode: 403,
      body: 'No code available in query params',
    };
  }

  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  const { tokens } = await oauth2Client.getToken(code);
  console.log('tokens', tokens);
  oauth2Client.setCredentials(tokens);
  console.log('past setting creds');

  // Store the tokens in the backend
  await fetchBackend('/drive-tokens', {
    method: 'POST',
    body: JSON.stringify(tokens),
  });

  return {
    statusCode: 201,
    body: 'Successfully connected your Google Drive account. You can close this page',
  };
};

export { handler };
