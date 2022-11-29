import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

const handler: Handler = async () => {
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

  // Access scopes for read-only Drive activity.
  const scopes = ['https://www.googleapis.com/auth/drive.readonly'];

  // Generate a url that asks permissions for the Drive activity scope
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
    // Requires the user to click the Allow button which gets us a refresh token.
    // This is only necessary because I use the same account and client_id in dev and prod.
    // If either of those changes between envs, we could remove this
    prompt: 'consent',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
};

export { handler };
