import React from 'react';

type ButtonProps = {
  title: string,
  onSubmit: () => void
}

export const Button = (props: ButtonProps) => {

  return (
    <div className='button-basic'>
      <div className='button'>
        <div className='button-title' onClick={props.onSubmit}>{props.title}</div>
      </div>
    </div>
  )
}

export default Button