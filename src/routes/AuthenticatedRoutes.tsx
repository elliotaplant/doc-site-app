import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { Content } from '../layout/Content';
import { Header } from '../layout/Header';
import { AccountPage } from '../pages/AccountPage';
import { NewSitePage } from '../pages/NewSitePage';
import { SitesPage } from '../pages/sites/SitesPage';

export function AuthenticatedRoutes() {
  useAuthCheck();

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
