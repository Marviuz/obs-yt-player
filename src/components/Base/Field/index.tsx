import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { BaseInputProps } from '@/types';

export interface FieldProps extends BaseInputProps {
  startComponent?: ReactNode;
  endComponent?: ReactNode;
  helperText?: ReactNode;
}

const Field: FC<FieldProps> = ({
  className,
  startComponent,
  endComponent,
  name,
  helperText,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        {startComponent}
        <input
          {...props}
          className={clsx(
            'focus:outline-none relative block w-full appearance-none  border border-gray-300 px-3 py-2 placeholder-gray-400 sm:text-sm bg-gray-900 text-white rounded-md',
            startComponent && 'rounded-none rounded-r-md',
            endComponent && 'rounded-none rounded-l-md'
          )}
        />
        {endComponent}
      </div>
      {helperText}
    </div>
  );
};

export default Field;
