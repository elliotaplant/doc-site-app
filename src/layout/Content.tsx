import { ReactNode } from 'react';

interface ContentProps {
  children?: ReactNode;
}

export function Content({ children }: ContentProps) {
  return <main className="scrollbar h-full py-8 px-6 md:overflow-y-auto md:px-8">{children}</main>;
}
