import React from 'react';

type InputProps = {
  name: string,
  type: string,
  value: string,
  setValue: ((arg: string) => void)
}

export const Input = (props: InputProps) => {

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target.value)

  return (
    <div className='input'>
      <label htmlFor={props.name} className='label'>{props.name}</label>
      <input 
        type={props.type}
        id={props.name}
        className='input-decoration' 
        // placeholder={props.name} 
        name={props.name} 
        onChange={handleValue} 
        value={props.value}
      />
    </div>  
  )
}

export default Input