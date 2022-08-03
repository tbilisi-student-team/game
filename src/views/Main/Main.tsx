import React from 'react';
import Header from '../../components/Header';
import Input from '../../components/Input'

export function Main () {
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
        <div className='left-character'>
          <img src='../../assets/buddy-1.png' />
        </div>
        <div className='signup'>
          <Input title='login'/>
          <Input title='password'/>
          <div className='button-basic'>
            <div className='button'>
              <div className='button-title'>Sign in</div>
            </div>
          </div>
          <div className='signup-link'>
            {'I\'m new here'}
          </div>
        </div>
        <div className='right-character'>
          <img src='../../assets/buddy-2-otr.png' />
        </div>
      </div>
    </div>
  )
}
