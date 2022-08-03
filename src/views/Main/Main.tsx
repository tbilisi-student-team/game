import React from 'react';
import Header from '../../components/Header';

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
    </div>
  )
}
