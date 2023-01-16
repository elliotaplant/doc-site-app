import { fetchBackend } from './backend';
import { expiresSoon } from './tokens';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';
import { streamToBuffer } from './format-page';
import AdmZip from 'adm-zip';
import { DOC_MIME_TYPE, FOLDER_MIME_TYPE } from './constants';

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.REACT_APP_CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
}

async function getOauth2Client(sub: string) {
  const tokensResponse = await fetchBackend(`/drive-tokens?userId=${sub}`);
  const tokens: Credentials = (await tokensResponse.json()) as any;
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  if (expiresSoon(tokens.expiry_date || Infinity)) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await fetchBackend(`/drive-tokens?userId=${sub}`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    oauth2Client.setCredentials(credentials);
  }

  return oauth2Client;
}

export async function exportDoc(fileId: string, sub: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client(sub);
  const response = await drive.files.export(
    { auth, fileId, mimeType: 'application/zip' },
    { responseType: 'stream' }
  );

  // Decode the exported zip in memory
  const buf = await streamToBuffer(response.data);
  return new AdmZip(buf);
}

export async function listFiles(query: string, sub: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client(sub);
  return drive.files.list({ q: query, auth, pageSize: 10 });
}

export async function getFile(fileId: string, sub: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client(sub);
  return drive.files.get({ fileId, auth });
}

export async function listFoldersAndDocs(driveFileId: string, sub: string) {
  const response = await listFiles(`parents in '${driveFileId}' and trashed=false`, sub);
  const { files } = response.data;
  if (!files || files.length === 0) {
    const response = await getFile(driveFileId, sub);
    if (!response.data) {
      return { folders: [], docs: [] };
    }
    return { folders: [], docs: [response.data] };
  }

  const folders = files.filter((file) => file.mimeType === FOLDER_MIME_TYPE);
  const docs = files.filter((file) => file.mimeType === DOC_MIME_TYPE);

  return { folders, docs };
}
