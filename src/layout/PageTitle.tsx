import { ReactNode } from 'react';

interface PageTitleProps {
  children?: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <header className="mt-6 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
      <h2 className="text-3xl font-semibold text-heading">{children}</h2>
    </header>
  );
}
