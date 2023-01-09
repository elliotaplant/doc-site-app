import { useIdentityContext } from 'react-netlify-identity';

export function UnconfirmedEmailPage() {
  const { user } = useIdentityContext();

  return (
    <div className="flex flex-col gap-4 p-4 align-middle">
      <h1 className="text-heading text-3xl font-semibold">Please confirm your email</h1>
      <p className="text-text mt-6 text-center text-sm">
        We sent an email to {user?.email} with a confirmation link. If you did not receive the
        email, please check your spam folder.
      </p>
    </div>
  );
}
