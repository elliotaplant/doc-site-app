import { Handler } from '@netlify/functions';
import { fetchBackend } from '../backend';
// const { google } = require('googleapis');
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

const handler: Handler = async () => {
  const tokensResponse = await fetchBackend('/drive-tokens');
  const tokens: Credentials = (await tokensResponse.json()) as any;
  console.log('tokens', tokens);

  // // Example of using Google Drive API to list filenames in user's Drive.
  const drive = google.drive('v3');
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  console.log('alpha');
  oauth2Client.setCredentials(tokens);

  // const response = await drive.files.list({
  //   // q: "mimeType = 'application/vnd.google-apps.folder'",
  //   q: "parents in 'root' and mimeType = 'application/vnd.google-apps.folder'",
  //   auth: oauth2Client,
  //   pageSize: 10,
  //   // fields: "nextPageToken, files(id, name)",
  // });

  // console.log('response.data', response.data);
  // const files = response.data.files;
  // if (files.length) {
  //   console.log('Files:');
  //   files.map((file) => {
  //     console.log(`${file.name} (${file.id})`);
  //   });
  // } else {
  //   console.log('No files found.');
  // }
  await new Promise((resolve, reject) => {
    console.log('beta');
    drive.files.list(
      {
        // q: "mimeType = 'application/vnd.google-apps.folder'",
        q: "parents in 'root' and mimeType = 'application/vnd.google-apps.folder'",
        auth: oauth2Client,
        pageSize: 10,
        // fields: "nextPageToken, files(id, name)",
      },
      (err, res) => {
        console.log('gamma');
        if (err) {
          reject(err);
        }

        console.log('res.data', res.data);
        const files = res.data.files;
        if (files.length) {
          console.log('Files:');
          files.map((file) => {
            console.log(`${file.name} (${file.id})`);
          });
        } else {
          console.log('No files found.');
        }
        resolve(null);
      }
    );
  });

  return { statusCode: 200 };
};

export { handler };
