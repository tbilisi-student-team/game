import React, {ButtonHTMLAttributes, DetailedHTMLProps} from 'react';

type ButtonProps = {
  name: string,
  onSubmit: () => void,
  disabled: boolean,
  type?: 'button' | 'submit',
}

export function Button(props: ButtonProps) {

  return (
    <button type={props.type || 'button'} className='button' onClick={props.onSubmit} disabled={props.disabled || false}>
      <span className='button-title'>{props.name}</span>
    </button>
  )
}
