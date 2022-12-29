import { SitesPage } from './pages/SitesPage';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import { LogInPage } from './pages/LogInPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { AccountPage } from './pages/AccountPage';

export function App() {
  if (!process.env.REACT_APP_IDENTITY_CONTEXT_URL) {
    return <h1>No identity URL provided</h1>;
  }

  return (
    <IdentityContextProvider url={process.env.REACT_APP_IDENTITY_CONTEXT_URL}>
      <PageRoutes />
    </IdentityContextProvider>
  );
}

export function PageRoutes() {
  const { isLoggedIn } = useIdentityContext();
  console.log('isLoggedIn', isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="*" element={<Navigate to="/log-in" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<SitesPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
