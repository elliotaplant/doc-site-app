import useSWR from 'swr';
import { useIdentityContext } from 'react-netlify-identity';

export function useAuthedGet<T = any>(route: string) {
  const { authedFetch } = useIdentityContext();
  return useSWR<T>(route, () => authedFetch.get(route));
}
