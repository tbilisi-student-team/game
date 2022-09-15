import React from 'react';
import Link from 'next/link';
import {RoutePaths} from '@/types/RoutePaths';
import { useAppContext } from '@/appContext/index';

export const Header = () => {
  const {
    currentUser: [ user ],
  } = useAppContext();

  return (
    <header className='header'>
      <div className='left__container'>
        <div>
          <Link className='header-link' href='/'>Home</Link>
        </div> 
        <div className='deriver'> | </div>
        <div>
          <Link className='header-link' href={RoutePaths.Forum}>Forum</Link>
        </div> 
        <div className='deriver'> | </div>
        <div>
          <Link className='header-link' href={RoutePaths.Leaderboard}>Our champions</Link>
        </div>
      </div>
      <div className='right__container'>
        {user.data == null && <>
          <div className='signin-link'>
            <Link className='header-link' href={RoutePaths.SignIn}>Sign in</Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link className='header-link' href={RoutePaths.SignUp}>Sign up</Link>
          </div></>
        }
        {user.data && <>
          <div className='profile-button'>
            <Link className='header-link' href={RoutePaths.User}>Profile</Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link className='header-link' href=''>Sign out</Link>
          </div></>
        }
      </div>
    </header>
  )
}

export default Header
