import { FC } from 'react';

import { BaseInputProps } from '@/types';

export interface RadioProps extends BaseInputProps {}

const Radio: FC<RadioProps> = ({ children, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        className="w-4 h-4 text-indigo-600 border-gray-300"
        {...props}
      />
      {children}
    </div>
  );
};

export default Radio;
