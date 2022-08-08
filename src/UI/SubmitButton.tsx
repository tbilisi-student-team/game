import React from 'react';

type ButtonProps = {
  title: string,
}

export const SubmitButton = (props: ButtonProps) => {

  return (
    <input 
      type='submit' 
      className='submit-button' 
      name={props.title} 
    />
  )
}

export default SubmitButton