import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from 'types/RoutePaths'
import { useAppContext } from 'AppContext';

export const Header = () => {
  const {
    currentUser: [ user ],
  } = useAppContext();

  return (
    <header className='header'>
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
        {user.data == null && <>
          <div className='signin-link'>
            <Link className='header-link' to={RoutePaths.SignIn}>Sign in</Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link className='header-link' to={RoutePaths.SignUp}>Sign up</Link>
          </div></>
        }
        {user.data && <>
          <div className='profile-button'>
            <Link className='header-link' to={RoutePaths.User}>Profile</Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link className='header-link' to=''>Sign out</Link>
          </div></>
        }
      </div>
    </header>
  )
}

export default Header
