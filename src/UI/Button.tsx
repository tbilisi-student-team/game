import React from 'react';

type ButtonProps = {
  title: string,
  onSubmit: () => void
}

export const Button = (props: ButtonProps) => {

  return (
    <button className='button' onClick={props.onSubmit}>
      <div className='button-title'>{props.title}</div>
    </button>
  )
}

export default Button