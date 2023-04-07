import { useField } from 'formik';
import { FC } from 'react';

import BaseCheckbox, {
  CheckboxProps as BaseCheckboxProps,
} from '@/components/Base/Checkbox';

interface CheckboxProps extends BaseCheckboxProps {
  name: string;
}

const Checkbox: FC<CheckboxProps> = ({ name, ...props }) => {
  const [field] = useField(name);

  return <BaseCheckbox {...field} {...props} />;
};

export default Checkbox;
