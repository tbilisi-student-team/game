import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from 'types';

import { AxiosError, AxiosResponse } from 'axios';
import { BASE_URL } from 'core/httpClient';
import * as userApi from 'remoteApi/users';

import { useAppContext } from 'AppContext';
import Header from '../../UI/Header';
import Input from '../../UI/Input';

import './index.css';

import buddy1 from 'assets/buddy-1.png';
import buddy2 from 'assets/buddy-2-otr.png';

export function User () {
  const navigate = useNavigate();

  //TODO put user to store
  const {
    userProfile: [ state, actions ],
  } = useAppContext();

  //TODO get user from store
  useEffect(function () {
    if (state.requestData.login === '') {
      actions.loadingStart();
      userApi.getCurrentUser().then(function (response: AxiosResponse<userApi.GetCurrentUserResponse>) {
        if (response.status === 200) {
          const responseData = response.data;

          actions.loadingSuccess(responseData);
          actions.setRequest(responseData);
        }
        else {
          throw new Error(`${response.status}: Unexpected error.`);
        }
      }).catch((error: AxiosError<userApi.ChangeUserProfileErrorResponse>) => {
        if (error.response) {
          if (error.response.status === 400) {
            actions.loadingError(new Error(`400: ${error.response.data.reason}.`));
          }
          else if (error.response.status === 401) {
            actions.loadingError(new Error('401: Unauthorized.'));
            navigate(RoutePaths.SignIn);
          }
          else if (error.response.status === 500) {
            actions.loadingError(new Error('500: Unexpected error.'));
          }
          else {
            actions.loadingError(new Error(`${error.response.status}: ${error.response.data.reason}.`));
          }
        }
        else if (error.request) {
          actions.loadingError(new Error('Unexpected error.'));
        }
        else {
          actions.loadingError(new Error(`${error.message}.`));
        }
        console.error(error);
      });
    }
  }, []);

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
          src={ state.responseData?.avatar ? `${BASE_URL}/resources${state.responseData?.avatar}` : buddy1 }
          alt={'Avatar'}>
        </img>
        <figcaption>{`${state.responseData?.display_name}#${state.responseData?.id}`}</figcaption>
      </figure>
      <div className='signin__container'>
        <div className='left-character__signin'>
          <img src={buddy1} />
        </div>

        {state.loading ? (
          <div>Loading...</div>
        ) : (
          <form className='signin-form' onSubmit={handleSubmit}>
            <Input
              type='email'
              id='email'
              name='email'
              placeholder='email'
              required={true}
              value={state.requestData.email}
              setValue={actions.setEmail}/>

            <Input
              type='tel'
              id='phone'
              name='phone'
              placeholder='phone'
              required={true}
              value={state.requestData.phone}
              setValue={actions.setPhone}/>

            <Input
              type='text'
              id='login'
              name='login'
              placeholder='login'
              required={true}
              value={state.requestData.login}
              setValue={actions.setLogin}/>

            <Input
              type='text'
              id='first_name'
              name='first_name'
              placeholder='first_name'
              required={true}
              value={state.requestData.first_name}
              setValue={actions.setFirstName}/>

            <Input
              type='text'
              id='second_name'
              name='second_name'
              placeholder='second_name'
              required={true}
              value={state.requestData.second_name}
              setValue={actions.setSecondName}/>

            <button
              disabled={state.loading}
              type={'button'}
              className={'button'}
              onClick={handleChangePassword}
            >
              <span className={'button-title'}>
                Change Password
              </span>
            </button>

            <button
              disabled={state.loading}
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
        )}

        <div className='right-character__signin'>
          <img src={buddy2} />
        </div>
      </div>
    </div>
  )
}
