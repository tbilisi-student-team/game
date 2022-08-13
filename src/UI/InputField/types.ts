import { ChangeEvent, InputHTMLAttributes } from 'react';
import { HookOutputFunction } from '../../hooks/useFormInput/types';

export type DefaultInputOnChangeFunction = (e: ChangeEvent<HTMLInputElement>) => void;

export type InputFieldOwnProps = {
  id?: string;
  className?: string;
  label?: string;
  errorText?: string | null;
  isValid?: boolean;
  view?: 'default' | 'labeled';
  onChangeHandle?: HookOutputFunction;
};

export type InputFieldProps = InputFieldOwnProps & InputHTMLAttributes<HTMLInputElement>;
