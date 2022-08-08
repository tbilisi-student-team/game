import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../UI/Header';
import Input from '../../UI/Input';
import SubmitButton from '../../UI/SubmitButton';

import { RoutePaths } from '../../types/RoutePaths'

export function SignIn () {
  const [ login, setLogin ] = useState('')
  const [ password, setPassword ] = useState('')


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(login, password)
  }

  return (
    <div className='wrapper'>
      <Header/>
      <div className='main'>
        <h1 className='main-title'>
          Pew!
        </h1>
        <h3 className='main-description'>
          Study project of Tbilisi Team
        </h3>
      </div>
      <div className='signin__container'>
        <div className='left-character__signin'>
          <img src='../../assets/buddy-1.png' />
        </div>
        <form className='signin-form' onSubmit={onSubmit}>
          <Input 
            type='text'
            name='login'
            id='login'
            placeholder='login'
            required={true}
            value={login}
            setValue={setLogin}/>
          <Input
            type='password'
            name='password'
            id='password'
            placeholder='password'
            required={true}
            value={password}
            setValue={setPassword}/>
          <SubmitButton title={'Sign in'}/>

          <div className='sign-link'>
            <Link className='header-link' to={RoutePaths.SignUp}>{'I\'m new here'}</Link>
          </div>
        </form>
        <div className='right-character__signin'>
          <img src='../../assets/buddy-2-otr.png' />
        </div>
      </div>
    </div>
  )
}
