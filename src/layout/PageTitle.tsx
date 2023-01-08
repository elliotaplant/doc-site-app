import { ReactNode } from 'react';

interface PageTitleProps {
  children?: ReactNode;
  actions?: ReactNode;
}

export function PageTitle({ children, actions }: PageTitleProps) {
  return (
    <header className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <h1 className="text-3xl font-semibold text-heading">{children}</h1>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </header>
  );
}
