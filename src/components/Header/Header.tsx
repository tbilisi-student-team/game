import React, {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {RoutePaths} from '@/types/RoutePaths';
import {useAppContext} from '@/appContext/index';
import {logout} from "@/remoteAPI/auth";
import {signOut, useSession} from 'next-auth/react';

export const Header = () => {
  const {
    currentUser: [ currentUserState, currentUserActions ],
  } = useAppContext();

  const nextRouter = useRouter();

  const session = useSession();

  function toggleTheme() {
    const wrapper = document.querySelector('.wrapper') as HTMLElement;
    if (wrapper) {
      const currentTheme = wrapper.dataset.theme;
      const nextTheme = currentTheme == 'light' ? 'dark' : 'light';
      switchTheme(nextTheme);
    }
  }

  function switchTheme(theme: string) {
    const wrapper = document.querySelector('.wrapper') as HTMLElement;
    if (wrapper) {
      wrapper.dataset.theme = theme;
      //Сохраняем тему пользователя
      if (currentUserState.data) {
        fetch('/api/user', {method: 'POST', body: JSON.stringify({id: currentUserState.data.id, theme})});
      }
    }
  }

  const handleLogout = () => {
    Promise.all(
      [
        signOut({callbackUrl: '/'}),
        logout({ withCredentials: true })
      ]
    ).then(([ signOutOAuth, signOutYandexAxiosResponse ]) => {
      currentUserActions.reset();
      nextRouter.push(RoutePaths.Main);
    }).catch((error) => {
      console.error(error);
    })
  }

  return (
    <header className='header'>
      <div className='left__container'>
        <Link href='/'><a className='header-link'>Home</a></Link>
        <span className='deriver'> | </span>

        {(currentUserState.data || session.data) && (
          <>
            <Link href={RoutePaths.Forum}><a className='header-link'>Forum</a></Link>
            <span className='deriver'> | </span>
          </>
        )}
        <Link href={RoutePaths.Leaderboard}><a className='header-link'>Our champions</a></Link>
      </div>
      <div className='right__container'>
        {currentUserState.data == null && session.data == null && <>
          <Link href={RoutePaths.SignIn}><a className='header-link'>Sign in</a></Link>
          <span className='deriver'> | </span>
          <Link href={RoutePaths.SignUp}><a className='header-link'>Sign up</a></Link>
        </>}
        {(currentUserState.data || session.data) && <>
          {nextRouter.pathname != RoutePaths.User && <>
            <Link href={RoutePaths.User}><a className='header-link'>Profile</a></Link>
            <span className='deriver'> | </span>
          </>}
          <Link href=''>
              <a
                className='header-link'
                onClick={(event) => {
                  handleLogout();
                }}
              >
                Sign out
              </a>
          </Link>
        </>}
        <span className='deriver'> | </span>
        <Link href=''>
          <a
            className='header-link'
            onClick={(event) => {
              event.preventDefault();
              toggleTheme();
            }}
          >
            Switch theme
          </a>
        </Link>
      </div>
    </header>
  )
}

export default Header;
