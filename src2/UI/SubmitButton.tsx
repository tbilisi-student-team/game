import React from 'react';

type ButtonProps = {
  name: string,
}

export const SubmitButton = (props: ButtonProps) => {

  return (
    <input 
      type='submit' 
      className='submit-button' 
      name={props.name} 
    />
  )
}

export default SubmitButton