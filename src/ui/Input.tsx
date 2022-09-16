import React from 'react';

type InputProps = {
  name: string,
  id: string,
  type: string,
  placeholder: string,
  required: boolean,
  value: string,
  setValue: ((value: string, name: string) => void),
  disabled: boolean,
  label?: string,
  className: string,
}

const defaultProps: InputProps = {
  name: '',
  id: '',
  type: 'text',
  placeholder: '',
  required: false,
  value: '',
  setValue: (() => { /**/ }),
  disabled: false,
  className: ''
}

export function Input (props: Partial<InputProps>) {
  props = { ...defaultProps, ...props };

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof props.setValue == 'function') {
      props.setValue(e?.target.value, e?.target.name);
    }
  }

  return (
    <div className={`input ${props.className}`}>
      <label htmlFor={props.id} className='label'>{props.label || props.name}</label>
      <input
        type={props.type}
        id={props.id}
        name={props.name}
        className='input-decoration'
        value={props.value}
        onChange={handleValue}
        disabled={props.disabled}
      />
    </div>
  )
}
