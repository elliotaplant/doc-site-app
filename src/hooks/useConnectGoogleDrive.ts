import { useIdentityContext } from 'react-netlify-identity';

export function useConnectGoogleDrive() {
  const { authedFetch } = useIdentityContext();
  return async () => {
    const { url } = await authedFetch.get('/.netlify/functions/drive-auth-url');
    window.open(url);
  };
}
