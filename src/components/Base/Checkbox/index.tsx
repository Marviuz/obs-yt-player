import { Field } from 'formik';
import { FC } from 'react';

import { BaseInputProps } from '@/types';

export interface CheckboxProps extends BaseInputProps {
  label: string;
}

const Checkbox: FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <div className="flex items-start">
      <div className="flex h-5 items-center">
        <Field
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={props.id} className="font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
