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
          <Link href='/'><a className='header-link'>Home</a></Link>
        </div> 
        <div className='deriver'> | </div>
        <div>
          <Link href={RoutePaths.Forum}><a className='header-link'>Forum</a></Link>
        </div> 
        <div className='deriver'> | </div>
        <div>
          <Link href={RoutePaths.Leaderboard}><a className='header-link'>Our champions</a></Link>
        </div>
      </div>
      <div className='right__container'>
        {user.data == null && <>
          <div className='signin-link'>
            <Link href={RoutePaths.SignIn}><a className='header-link'>Sign in</a></Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link href={RoutePaths.SignUp}><a className='header-link'>Sign up</a></Link>
          </div></>
        }
        {user.data && <>
          <div className='profile-button'>
            <Link href={RoutePaths.User}><a className='header-link'>Profile</a></Link>
          </div>
          <div className='deriver'> | </div>
          <div className='signup-link'>
            <Link href=''><a className='header-link'>Sign out</a></Link>
          </div></>
        }
      </div>
    </header>
  )
}

export default Header
