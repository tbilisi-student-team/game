import React from 'react';

type buttonProps = {
  title: string
}

export const Button = (props: buttonProps) => {

  return (
    <div className='button-basic'>
      <div className='button'>
        <div className='button-title'>{props.title}</div>
      </div>
    </div>
  )
}

export default Button