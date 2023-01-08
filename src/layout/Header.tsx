import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <h1 style={{ margin: 0 }}>DocSite</h1>

      <nav style={{ display: 'flex', gap: '4px' }}>
        <Link to="/">Sites</Link>
        <Link to="account">Account</Link>
      </nav>
    </header>
  );
}
