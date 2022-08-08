import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../UI/Header';
import Input from '../../UI/Input';
import SubmitButton from '../../UI/SubmitButton';


import { RoutePaths } from '../../types/RoutePaths'

export function SignUp () {
  const [ login, setLogin ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(login, password, email, phone)
  }

  return (
    <div className='wrapper'>
      <Header/>
      <div className='main'>
        <h2 className='signup-title'>
          Registration
        </h2>
      </div>
      <div className='signin__container'>
        <div className='left-character__signin'>
          <img src='../../assets/buddy-1.png' />
        </div>
        <form className='signin-form' onSubmit={onSubmit}>
          <Input 
            type='text' 
            id='login' 
            name='login' 
            placeholder='login' 
            required={true} 
            value={login} 
            setValue={setLogin}/>

          <Input 
            type='password' 
            id='password'
            name='password' 
            placeholder='password'
            required={true}
            value={password} 
            setValue={setPassword}/>

          <Input 
            type='text' 
            id='email'
            name='email' 
            placeholder='email' 
            required={true} 
            value={email} 
            setValue={setEmail}/>

          <Input 
            type='text'
            id='phone' 
            name='phone' 
            placeholder='phone'
            required={true}
            value={phone} 
            setValue={setPhone}/>

          <SubmitButton title={'Sign up'} />

          <div className='sign-link'>
            <Link className='header-link' to={RoutePaths.SignIn}>{'I already have an account'}</Link>
          </div>
          
        </form>
        <div className='right-character__signin'>
          <img src='../../assets/buddy-2-otr.png' />
        </div>
      </div>
    </div>
  )
}
