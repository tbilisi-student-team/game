import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {

  return (
    <div className='header__container'>
      <div className='left__container'>
        <div className='qa'>
          <Link className='header-link' to='/forum'>Q&A</Link>
        </div> 
        <div className='deriver'> | </div>
        <div className='leaderboard'>
          <Link className='header-link' to='/leaderboard'> Our champions</Link>
        </div>
      </div>
      <div className='right__container'>
        <div className='signin-link'>
          <Link className='header-link' to='/sign-in'>Sign in</Link>
        </div>
        <div className='deriver'> | </div>
        <div className='signup-link'>
          <Link className='header-link' to='/sign-in'>Sign up</Link>
        </div>
        <div className='profile-button hidden'></div>
      </div>
    </div>
  )
}

export default Header