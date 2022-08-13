import React from 'react';

type ButtonProps = {
  title: string
}

export const Button = (props: ButtonProps) => {

  return (
    <button className='button' type = 'submit'>
      <div className='button-title'>{props.title}</div>
    </button>
  )
}

export default Button