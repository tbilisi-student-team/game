import React from 'react';

type ButtonProps = {
  name: string,
  onSubmit: () => void
}

export function Button(props: ButtonProps) {

  return (
    <button className='button' onClick={props.onSubmit}>
      <div className='button-title'>{props.name}</div>
    </button>
  )
}
