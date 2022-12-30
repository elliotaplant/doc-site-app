import { useIdentityContext } from 'react-netlify-identity';

export function UnconfirmedEmailPage() {
  const { user } = useIdentityContext();
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
      <h1>Please confirm your email</h1>
      <p>
        We sent an email to {user?.email} with a confirmation link. If you did not receive the
        email, please check your spam folder.
      </p>
    </div>
  );
}
