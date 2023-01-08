import { ReactNode } from 'react';

interface ContentProps {
  children?: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <main
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        margin: '0 auto',
      }}
    >
      {children}
    </main>
  );
}
