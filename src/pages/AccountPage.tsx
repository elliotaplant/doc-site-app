import { useIdentityContext } from 'react-netlify-identity';
import { googleSigninButtonSrc } from '../icons';
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
      <div className="mt-4 flex justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <h3 className="font-semibold text-lg">{user!.email}</h3>
          <label className="mt-8 text-md">Connect to Google Drive</label>
          <button className="inline gap-6 items-center self-start" onClick={connectGoogleDrive}>
            <img src={googleSigninButtonSrc} alt="Google Sign in button" />
          </button>

          <button
            className="mt-8 border-muted-3 text-text hover:text-heading focus:text-heading disabled:hover:text-text inline-flex h-full w-full max-w-sm cursor-pointer items-center justify-center rounded-xl border-2 bg-transparent px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 dark:focus:ring-white/80"
            onClick={() => logoutUser()}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
