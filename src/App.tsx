import { SitesPage } from './pages/sites/SitesPage';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import { LogInPage } from './pages/LogInPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { AccountPage } from './pages/AccountPage';
import { ConfirmEmailPage } from './pages/ConfirmEmailPage';
import { UnconfirmedEmailPage } from './pages/UnconfirmedEmailPage';
import { Header } from './layout/Header';
import { NewSitePage } from './pages/NewSitePage';

export function App() {
  if (!process.env.REACT_APP_IDENTITY_CONTEXT_URL) {
    return <h1>No identity URL provided</h1>;
  }

  return (
    <IdentityContextProvider url={process.env.REACT_APP_IDENTITY_CONTEXT_URL}>
      <Header />
      <PageRoutes />
    </IdentityContextProvider>
  );
}

export function PageRoutes() {
  const { isLoggedIn, isConfirmedUser } = useIdentityContext();
  const { hash } = useLocation();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/log-in" element={<LogInPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        {hash && <Route path="/" element={<ConfirmEmailPage />} />}
        <Route path="*" element={<Navigate to="/log-in" replace />} />
      </Routes>
    );
  }

  if (!isConfirmedUser) {
    return <UnconfirmedEmailPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<SitesPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/new" element={<NewSitePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
