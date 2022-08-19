import React from 'react';

import { BASE_URL } from 'core/httpClient';

import { useAppContext } from 'AppContext';
import Header from '../../UI/Header';
import Input from '../../UI/Input';

import './index.css';

import buddy1 from 'assets/buddy-1.png';
import buddy2 from 'assets/buddy-2-otr.png';
import { useUserProfile } from 'hooks';

export function User () {
  const user = useAppContext().currentUser[0].data;

  if (user == null) {
    throw new Error('401');
  }

  const [ profile, actions ] = useUserProfile(user);

  const handleSubmit = () => {
    actions.loadingStart();
  }

  const handleChangeAvatar = () => {
    alert('Здесь будет смена аватара!');
  }

  const handleChangePassword = () => {
    alert('Здесь будет смена пароля!');
  }

  return (
    <div className='wrapper'>
      <Header/>
      <figure className={'avatar clickable'} onClick={handleChangeAvatar}>
        <img
          src={ user.avatar ? `${BASE_URL}/resources${user.avatar}` : buddy1 }
          alt={'Avatar'}>
        </img>
        <figcaption>{`${ user.display_name}#${user.id}`}</figcaption>
      </figure>
      <div className='main__container'>
        <div className='left-character-wrapper left-character-wrapper__main'>
          <img src={buddy1} alt='Buddy One' className='left-character'/>
        </div>

        <form className='signin-form' onSubmit={handleSubmit}>
          <Input
            type='email'
            id='email'
            name='email'
            placeholder='email'
            required={true}
            value={profile.changeProfileRequest.email}
            setValue={actions.setEmail}
            disabled={profile.isLoading}
          />


          <Input
            type='tel'
            id='phone'
            name='phone'
            placeholder='phone'
            required={true}
            value={profile.changeProfileRequest.phone}
            setValue={actions.setPhone}/>

          <Input
            type='text'
            id='login'
            name='login'
            placeholder='login'
            required={true}
            value={profile.changeProfileRequest.login}
            setValue={actions.setLogin}/>

          <Input
            type='text'
            id='first_name'
            name='first_name'
            placeholder='first_name'
            required={true}
            value={profile.changeProfileRequest.first_name}
            setValue={actions.setFirstName}/>

          <Input
            type='text'
            id='second_name'
            name='second_name'
            placeholder='second_name'
            required={true}
            value={profile.changeProfileRequest.second_name}
            setValue={actions.setSecondName}/>

          <button
            disabled={profile.isLoading}
            type={'button'}
            className={'button'}
            onClick={handleChangePassword}
          >
            <span className={'button-title'}>
              Change Password
            </span>
          </button>

          <button
            disabled={profile.isLoading}
            type={'submit'}
            className={'button'}
          >
            <span className={'button-title'}>
              Save
            </span>
          </button>

          {profile.error && (
            <div>{profile.error.message}</div>
          )}
        </form>

        <div className='right-character-wrapper right-character-wrapper__main'>
          <img src={buddy2} alt='Buddy Two' className='right-character'/>
        </div>
      </div>
    </div>
  )
}
