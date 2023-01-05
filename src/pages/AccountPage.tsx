import { useIdentityContext } from 'react-netlify-identity';

export function AccountPage() {
  const { user, logoutUser } = useIdentityContext();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
      }}
    >
      <h1>Account</h1>
      <h3>Hello {JSON.stringify(user!.email)}</h3>
      <button onClick={() => logoutUser()}>Log out</button>
    </div>
  );
}
