import React from 'react';

type inputProps = {
  title: string,
  value: string,
  setValue: ((arg: string) => void)
}

export const Input = (props: inputProps) => {

  // const [ value, setValue ] = useState('')


  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => props.setValue(e?.target.value)

  return (
    <div className='input-basic'>
      <input 
        className='input-decoration' 
        placeholder={props.title} 
        name={props.title} 
        onChange={handleValue} 
        value={props.value}
      />
    </div>  
  )
}

export default Input