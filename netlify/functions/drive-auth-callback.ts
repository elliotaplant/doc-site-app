import { Handler } from '@netlify/functions';
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

  return {
    statusCode: 200,
    body: JSON.stringify({ tokens }),
  };
};

export { handler };
