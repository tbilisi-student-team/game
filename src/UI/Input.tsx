import React from 'react';

type InputProps = {
  name: string,
  value: string,
  setValue: ((arg: string) => void)
}

export const Input = (props: InputProps) => {

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target.value)

  return (
    <div className='input'>
      <input 
        className='input-decoration' 
        placeholder={props.name} 
        name={props.name} 
        onChange={handleValue} 
        value={props.value}
      />
    </div>  
  )
}

export default Input