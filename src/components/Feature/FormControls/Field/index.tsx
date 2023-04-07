import { useField } from 'formik';
import { FC, ReactNode } from 'react';

import BaseField, {
  FieldProps as BaseFieldProps,
} from '@/components/Base/Field';

interface FieldProps extends BaseFieldProps {
  name: string;
  helperText?: ReactNode;
}

const Field: FC<FieldProps> = ({ name, helperText, ...props }) => {
  const [field, meta] = useField(name);

  return (
    <BaseField
      {...field}
      {...props}
      helperText={
        helperText ? (
          helperText
        ) : meta.touched && meta.error ? (
          <div className="my-1 text-sm text-red-500">{meta.error}</div>
        ) : null
      }
    ></BaseField>
  );
};

export default Field;
