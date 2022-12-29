import { useIdentityContext } from 'react-netlify-identity';

export function AccountPage() {
  const { user, logoutUser } = useIdentityContext();

  return (
    <>
      <h1>Account</h1>
      <div>
        <h3 style={{ marginTop: '10vh' }}>Hello {JSON.stringify(user!.email)}</h3>
        <button onClick={() => logoutUser()}>Log out</button>
      </div>
    </>
  );
}
