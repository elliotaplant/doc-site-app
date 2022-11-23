import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
// const { google } = require('googleapis');
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

const handler: Handler = async () => {
  const tokensResponse = await fetchBackend('/drive-tokens');
  const tokens: Credentials = (await tokensResponse.json()) as any;

  // // Example of using Google Drive API to list filenames in user's Drive.
  const drive = google.drive('v3');
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oauth2Client.setCredentials(tokens);

  const response = await drive.files.list({
    // q: "mimeType = 'application/vnd.google-apps.folder'",
    q: "parents in 'root' and mimeType = 'application/vnd.google-apps.folder'",
    auth: oauth2Client,
    pageSize: 10,
    // fields: "nextPageToken, files(id, name)",
  });

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
