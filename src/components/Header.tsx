import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {

  return (
    <div className='header__container'>
      <div className='left__container'>
        <div className='qa'>
          <Link className='header-link' to='/forum'>Q&A</Link>
        </div>
      </div>
      <div className='right__container'>
        <div className='leaderboard'>
          <Link className='header-link' to='/leaderboard'>Our champions</Link>
        </div>
        <div className='profile-button hidden'></div>
      </div>
    </div>
  )
}

export default Header