import { fetchBackend } from './backend';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

async function getOauth2Client() {
  const tokensResponse = await fetchBackend('/drive-tokens');
  const tokens: Credentials = (await tokensResponse.json()) as any;

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oauth2Client.setCredentials(tokens);

  return oauth2Client;
}

export async function exportFile(fileId: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client();
  return drive.files.export(
    { auth, fileId, mimeType: 'application/zip' },
    { responseType: 'stream' }
  );
}

export async function listFiles(query: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client();
  return drive.files.list({ q: query, auth, pageSize: 10 });
}
