import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';

const { google } = require('googleapis');

const handler: Handler = async (event, context) => {
  const code: string | undefined = event.queryStringParameters?.code;
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
  oauth2Client.setCredentials(tokens);

  // Store the tokens in the backend
  await fetchBackend('/drive-tokens', {
    method: 'POST',
    body: JSON.stringify(tokens),
  });

  return {
    statusCode: 201,
    body: JSON.stringify({ tokens }),
  };
};

export { handler };
