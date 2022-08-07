import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../UI/Header';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

import { RoutePaths } from '../../types/RoutePaths'

export function SignUp () {
  const [ login, setLogin ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState('')

  const onSubmit = () => {
    console.log(login, password)
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
        <form className='signin-form'>
          <Input type='text' name='login' value={login} setValue={setLogin}/>
          <Input type='password' name='password' value={password} setValue={setPassword}/>

          <Input type='text' name='email' value={email} setValue={setEmail}/>
          <Input type='phone' name='phone' value={phone} setValue={setPhone}/>


          <Link className='header-link' to={RoutePaths.Main}>
            <Button title={'Sign up'} onSubmit={onSubmit}/>
          </Link>

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
