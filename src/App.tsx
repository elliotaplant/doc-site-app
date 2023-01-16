import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import { UnconfirmedEmailPage } from './pages/UnconfirmedEmailPage';
import { UnauthenticatedRoutes } from './routes/UnauthenticatedRoutes';
import { AuthenticatedRoutes } from './routes/AuthenticatedRoutes';

export function App() {
  if (!process.env.REACT_APP_IDENTITY_CONTEXT_URL) {
    return <h1>No identity URL provided</h1>;
  }

  return (
    <IdentityContextProvider url={process.env.REACT_APP_IDENTITY_CONTEXT_URL}>
      <div className="relative min-h-screen flex-1 md:overflow-hidden">
        <PageRoutes />
      </div>
    </IdentityContextProvider>
  );
}

export function PageRoutes() {
  const { isLoggedIn, isConfirmedUser } = useIdentityContext();

  if (!isLoggedIn) {
    return <UnauthenticatedRoutes />;
  }

  if (!isConfirmedUser) {
    return <UnconfirmedEmailPage />;
  }

  return <AuthenticatedRoutes />;
}
