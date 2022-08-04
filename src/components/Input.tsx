import React, { useState } from 'react';

type inputProps = {
  title: string
}

export const Input = (props: inputProps) => {

  const [ value, setValue ] = useState('')


  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e?.target.value)

  return (
    <div className='input-basic'>
      <input 
        className='input-decoration' 
        placeholder={props.title} 
        name={props.title} 
        onChange={handleValue} 
        value={value}
      />
    </div>  
  )
}

export default Input