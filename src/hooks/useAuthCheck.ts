import { useEffect } from 'react';
import { useIdentityContext } from 'react-netlify-identity';

export function useAuthCheck() {
  const { isLoggedIn, isConfirmedUser, logoutUser, authedFetch } = useIdentityContext();
  return useEffect(() => {
    if (isLoggedIn && isConfirmedUser) {
      authedFetch
        .get('/.netlify/functions/is-authed')
        .then(({ authed }) => {
          if (!authed) {
            throw new Error('Unauthorized');
          }
        })
        .catch(() => logoutUser());
    }
  });
}
