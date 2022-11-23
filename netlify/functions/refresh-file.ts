import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
// const { google } = require('googleapis');
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

const handler: Handler = async () => {
  const tokensResponse = await fetchBackend('/drive-tokens');
  const tokens: Credentials = (await tokensResponse.json()) as any;
  console.log('tokens', tokens);

  // Example of using Google Drive API to list filenames in user's Drive.
  const drive = google.drive('v3');
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oauth2Client.setCredentials(tokens);

  console.log('alpha');
  const response = await drive.files.export({
    auth: oauth2Client,
    fileId: '1h68ecL4rxSxAHwj7sh5L5nxpu6Uih3PQa2DtHFLTK5Y',
    mimeType: 'text/html',
  });
  console.log('response.data', response.data);

  return { statusCode: 200 };
};

export { handler };
