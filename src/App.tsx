import { IdentityContextProvider, useIdentityContext } from 'react-netlify-identity';
import { LogInPage } from './pages/LogInPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { AccountPage } from './pages/AccountPage';
import { ConfirmEmailPage } from './pages/ConfirmEmailPage';
import { UnconfirmedEmailPage } from './pages/UnconfirmedEmailPage';
import { Header } from './layout/Header';
import { NewSitePage } from './pages/NewSitePage';
import { Content } from './layout/Content';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { SitesPage } from './pages/sites/SitesPage';

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
    <>
      <Header />
      <Content>
        <Routes>
          <Route path="/" element={<SitesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/new" element={<NewSitePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </>
  );
}
