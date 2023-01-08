import { useIdentityContext } from 'react-netlify-identity';
import { PageTitle } from '../layout/PageTitle';

export function AccountPage() {
  const { user, logoutUser } = useIdentityContext();
  const { authedFetch } = useIdentityContext();

  const connectGoogleDrive = async () => {
    const { url } = await authedFetch.get('/.netlify/functions/drive-auth-url');
    console.log('url', url);
    window.open(url);
  };

  return (
    <>
      <PageTitle>Account</PageTitle>
      <h3>Hello {JSON.stringify(user!.email)}</h3>
      <button style={{ width: 100 }} onClick={connectGoogleDrive}>
        Connect to Google Drive
      </button>
      <button onClick={() => logoutUser()}>Log out</button>
    </>
  );
}
