import React from 'react';

type InputProps = {
  name: string,
  id: string,
  type: string,
  placeholder: string,
  required: boolean,
  value: string,
  setValue: ((arg: string) => void)
}

export const Input = (props: InputProps) => {

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target.value)

  return (
    <div className='input'>
      <label htmlFor={props.id} className='label'>{props.name}</label>
      <input
        type={''}
        id={props.id}
        name={props.name}
        className='input-decoration'
        value={props.value}
        onChange={handleValue}
      />
    </div>
  )
}

export default Input
