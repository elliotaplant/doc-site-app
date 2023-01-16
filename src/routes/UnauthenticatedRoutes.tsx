import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { ConfirmEmailPage } from '../pages/ConfirmEmailPage';
import { CreateAccountPage } from '../pages/CreateAccountPage';
import { LogInPage } from '../pages/LogInPage';

export function UnauthenticatedRoutes() {
  const { hash } = useLocation();

  return (
    <Routes>
      <Route path="/log-in" element={<LogInPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      {hash && <Route path="/" element={<ConfirmEmailPage />} />}
      <Route path="*" element={<Navigate to="/log-in" replace />} />
    </Routes>
  );
}
