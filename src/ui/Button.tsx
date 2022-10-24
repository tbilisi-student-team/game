import React from 'react';

type ButtonProps = {
  name: string,
  onSubmit: () => void,
  disabled: boolean
}

export function Button(props: ButtonProps) {

  return (
    <button className='button' onClick={props.onSubmit} disabled={props.disabled || false}>
      <div className='button-title'>{props.name}</div>
    </button>
  )
}
