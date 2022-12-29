import { SitesPage } from './pages/SitesPage';
import { Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SitesPage />} />
    </Routes>
  );
}
