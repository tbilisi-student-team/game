import React from 'react';

type inputProps = {
  title: string
}

export const Input = (props: inputProps) => {

  return (
    <div className='input-basic'>
      <input className='input-decoration' placeholder={props.title} />
    </div>  
  )
}

export default Input