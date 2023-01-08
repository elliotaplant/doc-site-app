import { ReactNode } from 'react';

interface PageTitleProps {
  children?: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return <h2 style={{ margin: 0, alignSelf: 'flex-start' }}>{children}</h2>;
}
