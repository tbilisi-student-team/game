import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../UI/Header';
import Input from '../../UI/Input';
import Button from '../../UI/Button';

export function SignIn () {
  const [ login, setLogin ] = useState('')
  const [ password, setPassword ] = useState('')


  const onSubmit = () => {
    console.log(login, password)
  }

  return (
    <div className='main__container'>
      {<Header/>}
      <div className='main'>
        <div className='main-title'>
          Pew!
        </div>
        <div className='main-description'>
          Study project of Tbilisi Team
        </div>
      </div>
      <div className='signin__container'>
        <div className='left-character__signin'>
          <img src='../../assets/buddy-1.png' />
        </div>
        <form className='signup'>
          <Input title='login' value={login} setValue={setLogin}/>
          <Input title='password' value={password} setValue={setPassword}/>
          <Link className='header-link' to='/main'>
            <Button title={'Sign in'} onSubmit={onSubmit}/>
          </Link>

          <div className='signup-link'>
            <Link className='header-link' to='/sign-up'>{'I\'m new here'}</Link>
          </div>
        </form>
        <div className='right-character__signin'>
          <img src='../../assets/buddy-2-otr.png' />
        </div>
      </div>
    </div>
  )
}
