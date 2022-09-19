import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Image from 'next/image';

import { YP_TECH_BASE_URL as BASE_URL } from '@/config/index';
import { ChangeUserPasswordRequest, ChangeUserProfileRequest, UserResponse } from '@/remoteAPI/index';

import { useAppContext } from '@/appContext/index';

import { Layout } from '@/components/Layout';
import { Input } from '@/ui/Input';

import styles from './index.module.css';

import buddy1 from '@/public/buddy-1.png';

export default function User () {
  const {
    currentUser: [ state, actions ]
  } = useAppContext();

  const { data: user } = state;

  if (user == null) {
    throw new Error('401');
  }

  const [ profileFormData, setProfileFormData ] = useState(user);
  const [ passwordData, setPasswordData ] = useState<ChangeUserPasswordRequest & { newPasswordRepeat: string }>({
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: ''
  });
  const [ newPasswordError, setNewPasswordError ] = useState('');

  const isProfileFormReady = function (profileFormData: UserResponse) {
    return !Object.keys(profileFormData).every((key) =>
      profileFormData[key as keyof UserResponse] === user[key as keyof ChangeUserProfileRequest]
    );
  }

  const isPasswordFormReady = function (passwordData: ChangeUserPasswordRequest & { newPasswordRepeat: string }) {
    return passwordData.oldPassword && passwordData.newPassword && passwordData.newPasswordRepeat;
  }

  const [ isProfileFormReadyState, setProfileFormReady ] = useState(isProfileFormReady(profileFormData));
  const [ isPasswordFormReadyState, setPasswordFormReady ] = useState(isPasswordFormReady(passwordData));

  const handleChangeInput = (value: string, name: string) => {
    setProfileFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value
      }

      setProfileFormReady(isProfileFormReady(newState));
      return newState;
    });
  }

  const handleChangePasswordInput = (value: string, name: string) => {
    setPasswordData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value
      }

      setPasswordFormReady(isPasswordFormReady(newState));
      return newState;
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

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (isPasswordFormReady(passwordData)) {
      if (passwordData.newPassword === passwordData.newPasswordRepeat) {
        actions.changeUserPassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        });
      }
      setNewPasswordError('New passwords are not equal');
    }
  }

  return (
    <Layout heading={''} subheading={''}>
      <div className='description'>
        <div className={`avatar ${styles.avatar}`}>
          <Image
            src={ user.avatar ? `${BASE_URL}/resources${user.avatar}` : buddy1 }
            alt={'Avatar'}>
          </Image>
          <br></br>
          <button type={'button'} onClick={() => { fileInputRef.current?.click() }}>Change</button>
          <input ref={fileInputRef} type={'file'} style={{ display: 'none' }} onChange={handleChangeAvatar} />
        </div>

        <h3>{`${user.display_name}#${user.id}`}</h3>

        <div className='main__container'>
          <div className='wrapper'>
            <form onSubmit={handleSubmit}>
              <Input
                type='email'
                id='email'
                name='email'
                placeholder='email'
                required
                value={profileFormData.email}
                setValue={handleChangeInput}
                disabled={state.isLoading}
              />

              <Input
                type='tel'
                id='phone'
                name='phone'
                placeholder='phone'
                required
                value={profileFormData.phone}
                setValue={handleChangeInput}/>

              <Input
                type='text'
                id='login'
                name='login'
                placeholder='login'
                required
                value={profileFormData.login}
                setValue={handleChangeInput}/>

              <Input
                type='text'
                id='first_name'
                name='first_name'
                placeholder='first_name'
                required
                value={profileFormData.first_name}
                setValue={handleChangeInput}/>

              <Input
                type='text'
                id='second_name'
                name='second_name'
                placeholder='second_name'
                required
                value={profileFormData.second_name}
                setValue={handleChangeInput}/>

              <Input
                type='text'
                id='display_name'
                name='display_name'
                placeholder='display_name'
                required
                value={profileFormData.display_name}
                setValue={handleChangeInput}/>

              <button
                disabled={state.isLoading || !isProfileFormReadyState}
                type={'submit'}
                className={'button'}
              >
                <span className={'button-title'}>
                  Save
                </span>
              </button>
            </form>

            <form onSubmit={handleChangePassword}>
              <Input
                type='password'
                id='oldPassword'
                name='oldPassword'
                placeholder='Current password'
                required
                value={passwordData.oldPassword}
                setValue={handleChangePasswordInput}/>

              <Input
                type='password'
                id='newPassword'
                name='newPassword'
                label={newPasswordError ? newPasswordError : 'New password'}
                placeholder='New password'
                required
                className={newPasswordError ? 'input-invalid' : ''}
                value={passwordData.newPassword}
                setValue={handleChangePasswordInput}/>

              <Input
                type='password'
                id='newPasswordRepeat'
                name='newPasswordRepeat'
                label={newPasswordError ? newPasswordError : 'New password (repeat)'}
                placeholder='Repeat new password'
                required
                className={newPasswordError ? 'input-invalid' : ''}
                value={passwordData.newPasswordRepeat}
                setValue={handleChangePasswordInput}/>

              <button
                disabled={state.isLoading || !isPasswordFormReadyState}
                type={'submit'}
                className={'button'}
              >
                <span className={'button-title'}>
                  Change Password
                </span>
              </button>
            </form>

            {state.error && (
              <div>{state.error.message}</div>
            )}
          </div>
      </div>
      </div>
    </Layout>
  )
}
