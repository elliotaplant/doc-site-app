import { Link } from 'react-router-dom';
import { docSiteLogoSrc } from '../icons';

export function Header() {
  return (
    <header className="relative z-20 flex h-16 flex-1 shrink-0 items-center justify-between bg-layer-2 px-4 shadow sm:px-6">
      <h1 className="text-heading text-3xl font-semibold flex gap-2">
        <img src={docSiteLogoSrc} alt="DocSite Logo" className="inline-block w-8" />
        <span>DocSite</span>
      </h1>
      <nav className="flex space-x-4">
        <Link to="/" className="text-lg font-semibold text-heading">
          Sites
        </Link>
        <Link to="account" className="text-lg font-semibold text-heading">
          Account
        </Link>
      </nav>
    </header>
  );
}
