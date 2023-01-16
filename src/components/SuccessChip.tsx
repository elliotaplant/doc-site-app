import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

export const SuccessChip: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <span className="inline-flex items-center rounded-full border-2 border-green-200 bg-green-200 px-2 py-1 text-sm font-semibold text-green-600 shadow-sm self-start">
      <CheckCircleIcon className="mr-1 h-5 w-5" />
      {children}
    </span>
  );
};
