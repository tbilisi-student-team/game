import React from 'react';

type ButtonProps = {
  title: string,
  onSubmit: () => void
}

export const Button = (props: ButtonProps) => {

  return (
    <button className='button'>
      <div className='button-title' onClick={props.onSubmit}>{props.title}</div>
    </button>
  )
}

export default Button