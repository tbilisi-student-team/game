import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {RoutePaths} from '@/types/RoutePaths';
import { useAppContext } from '@/appContext/index';
import {logout} from "@/remoteAPI/auth";

export const Header = () => {
  const {
    currentUser: [ currentUserState, currentUserActions ],
  } = useAppContext();

  const nextRouter = useRouter();

  const handleLogout = () => {
    logout({ withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          currentUserActions.reset();
          nextRouter.push(RoutePaths.Main);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  return (
    <header className='header'>
      <div className='left__container'>
        <Link href='/'><a className='header-link'>Home</a></Link>
        <span className='deriver'> | </span>
        <Link href={RoutePaths.Forum}><a className='header-link'>Forum</a></Link>
        <span className='deriver'> | </span>
        <Link href={RoutePaths.Leaderboard}><a className='header-link'>Our champions</a></Link>
      </div>
      <div className='right__container'>
        {currentUserState.data == null && <>
          <Link href={RoutePaths.SignIn}><a className='header-link'>Sign in</a></Link>
          <span className='deriver'> | </span>
          <Link href={RoutePaths.SignUp}><a className='header-link'>Sign up</a></Link>
        </>}
        {currentUserState.data && <>
          {nextRouter.pathname != RoutePaths.User && <>
            <Link href={RoutePaths.User}><a className='header-link'>Profile</a></Link>
            <span className='deriver'> | </span>
          </>}
          <Link href=''>
            <a
              className='header-link'
              onClick={(event) => {
                event.preventDefault();
                handleLogout()
              }}
            >Sign out
            </a>
          </Link>
          </>
        }
      </div>
    </header>
  )
}

export default Header
