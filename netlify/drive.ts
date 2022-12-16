import { fetchBackend } from './backend';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';
import { streamToBuffer } from './format-page';
import AdmZip from 'adm-zip';
import { DOC_MIME_TYPE, FOLDER_MIME_TYPE } from './constants';

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

export async function exportDoc(fileId: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client();
  const response = await drive.files.export(
    { auth, fileId, mimeType: 'application/zip' },
    { responseType: 'stream' }
  );

  // Decode the exported zip in memory
  const buf = await streamToBuffer(response.data);
  return new AdmZip(buf);
}

export async function listFiles(query: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client();
  return drive.files.list({ q: query, auth, pageSize: 10 });
}

export async function getFile(fileId: string) {
  const drive = google.drive('v3');
  const auth = await getOauth2Client();
  return drive.files.get({ fileId, auth });
}

export async function listFoldersAndDocs(driveFileId: string) {
  const response = await listFiles(`parents in '${driveFileId}'`);
  const { files } = response.data;
  if (!files || files.length === 0) {
    const response = await getFile(driveFileId);
    if (!response.data) {
      return { folders: [], docs: [] };
    }
    return { folders: [], docs: [response.data] };
  }

  const folders = files.filter((file) => file.mimeType === FOLDER_MIME_TYPE);
  const docs = files.filter((file) => file.mimeType === DOC_MIME_TYPE);

  return { folders, docs };
}
