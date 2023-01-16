import { ReactNode } from 'react';

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p aria-live="polite" className="mt-2 text-xs font-medium text-red-400">
      {children}
    </p>
  );
}
