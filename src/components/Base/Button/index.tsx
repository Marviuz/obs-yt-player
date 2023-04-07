import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from 'react';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: FC<ButtonProps> = ({ disabled, children, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        'relative flex justify-center w-full px-4 py-2 text-sm font-medium  border border-transparent rounded-md ',
        disabled
          ? 'bg-gray-500 text-gray-800 hover:bg-gray-500'
          : 'text-white bg-indigo-600 hover:bg-indigo-700'
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
