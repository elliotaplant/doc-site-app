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
      <h3 className="font-semibold">{user!.email}</h3>
      <button
        className="inline-flex h-full w-full max-w-sm cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
        onClick={connectGoogleDrive}
      >
        Connect to Google Drive
      </button>
      <button
        className="inline-flex h-full w-full max-w-sm cursor-pointer items-center justify-center rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 text-sm font-semibold text-text shadow-sm hover:text-heading focus:text-heading focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:text-text dark:focus:ring-white/80"
        onClick={() => logoutUser()}
      >
        Log out
      </button>
    </>
  );
}
