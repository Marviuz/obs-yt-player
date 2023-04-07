import { useField } from 'formik';
import { FC } from 'react';

import BaseRadio, {
  RadioProps as BaseRadioProps,
} from '@/components/Base/Radio';

export interface RadioProps extends BaseRadioProps {
  name: string;
}

const Radio: FC<RadioProps> = ({ name, ...props }) => {
  const [field] = useField(name);

  return <BaseRadio {...field} {...props} />;
};

export default Radio;
