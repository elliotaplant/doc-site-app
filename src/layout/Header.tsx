import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <span>DocSite</span>

      <nav style={{ display: 'flex', gap: '4px' }}>
        <Link to="/">Sites</Link>
        <Link to="account">Account</Link>
      </nav>
    </header>
  );
}
