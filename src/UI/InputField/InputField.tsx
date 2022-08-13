
import React, { ChangeEvent } from 'react';
import { InputFieldProps } from './types';




export const InputField = ({
  id,
  type = 'text',
  className,
  isValid = false,
  view = 'default',
  label,
  errorText = 'Error in this field',
  onChangeHandle,
  ...props
}: InputFieldProps) => {
  const errorField = !isValid ? <div className={'error-text'}>{errorText}</div> : null;

  const labelField = label ? (
    <label htmlFor={id} className={'label'}>
      {label}
    </label>
  ) : null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>, equal?: string) => {
    const newValue = e.target.value;
    if (onChangeHandle) {
      return onChangeHandle({ value: newValue, equal });
    }
    return null;
  };

  return (
    <div className={className}>
      {labelField}
      <input id={id} type={type} className={'input-decoration'} onChange={handleChange} {...props} />
      {errorField}
    </div>
  );
};
