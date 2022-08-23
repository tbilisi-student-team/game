import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { BASE_URL } from 'core/httpClient';

import { useAppContext } from 'AppContext';
import Header from '../../UI/Header';
import Input from '../../UI/Input';

import './index.css';

import buddy1 from 'assets/buddy-1.png';
import buddy2 from 'assets/buddy-2-otr.png';
// import { ChangeUserPasswordRequest } from 'remoteApi';

export function User () {
  const {
    currentUser: [ state, actions ]
  } = useAppContext();

  const { data: user } = state;

  if (user == null) {
    throw new Error('401');
  }

  const [ profileFormData, setProfileFormData ] = useState(user);
  // const [ passwordData, setPasswordData ] = useState<ChangeUserPasswordRequest & { newPasswordRepeat: string }>({
  //   oldPassword: '',
  //   newPassword: '',
  //   newPasswordRepeat: ''
  // });

  const handleChangeInput = (value: string, name: string) => {
    setProfileFormData((prevState) => {
      return {
        ...prevState,
        [name]: value
      }
    });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    actions.changeUserProfile(profileFormData);
  }

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files?.item(0);

    if (fileData) {
      const formData = new FormData();

      formData.append('avatar', fileData);
      actions.changeUserAvatar(formData);
    }
  }

  const handleChangePassword = () => {
    alert('Здесь будет смена пароля!');
  }

  return (
    <div className='wrapper'>
      <Header/>

      <div className={'avatar'}>
        <img
          src={ user.avatar ? `${BASE_URL}/resources${user.avatar}` : buddy1 }
          alt={'Avatar'}>
        </img>
        <br></br>
        <button type={'button'} onClick={() => { fileInputRef.current?.click() }}>Change</button>
        <input ref={fileInputRef} type={'file'} style={{ display: 'none' }} onChange={handleChangeAvatar} />
      </div>

      <h3>{`${user.display_name}#${user.id}`}</h3>{/* TODO update correctly (use profile?) */}

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
            value={profileFormData.email}
            setValue={handleChangeInput}
            disabled={state.isLoading}
          />

          <Input
            type='tel'
            id='phone'
            name='phone'
            placeholder='phone'
            required={true}
            value={profileFormData.phone}
            setValue={handleChangeInput}/>

          <Input
            type='text'
            id='login'
            name='login'
            placeholder='login'
            required={true}
            value={profileFormData.login}
            setValue={handleChangeInput}/>

          <Input
            type='text'
            id='first_name'
            name='first_name'
            placeholder='first_name'
            required={true}
            value={profileFormData.first_name}
            setValue={handleChangeInput}/>

          <Input
            type='text'
            id='second_name'
            name='second_name'
            placeholder='second_name'
            required={true}
            value={profileFormData.second_name}
            setValue={handleChangeInput}/>

          <Input
            type='text'
            id='display_name'
            name='display_name'
            placeholder='display_name'
            required={true}
            value={profileFormData.display_name}
            setValue={handleChangeInput}/>

          <button
            disabled={state.isLoading}
            type={'button'}
            className={'button'}
            onClick={handleChangePassword}
          >
            <span className={'button-title'}>
              Change Password
            </span>
          </button>

          <button
            disabled={state.isLoading}
            type={'submit'}
            className={'button'}
          >
            <span className={'button-title'}>
              Save
            </span>
          </button>

          {state.error && (
            <div>{state.error.message}</div>
          )}
        </form>

        <div className='right-character-wrapper right-character-wrapper__main'>
          <img src={buddy2} alt='Buddy Two' className='right-character'/>
        </div>
      </div>
    </div>
  )
}
