import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../UI/Input';

import { RoutePaths } from 'types';
import { useAppContext } from 'AppContext';
import { signin, SignInErrorResponse, SignInResponse } from 'remoteApi';
import { AxiosError, AxiosResponse } from 'axios';




export function SignIn () {
  const navigate = useNavigate();

  const {
    signIn: [ state, actions ],
  } = useAppContext();

  const handleSignIn = () => {
    actions.loadingStart();

    signin(state.requestData)
      .then((axiosResponse: AxiosResponse<SignInResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          actions.loadingSuccess(responseData);

          navigate(RoutePaths.StartGame);
        } else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<SignInErrorResponse>) => {
        if (error.response) {
          if (error.response.status === 400) {
            actions.loadingError(new Error(`400: ${error.response.data.reason}.`));
          } else if (error.response.status === 401) {
            actions.loadingError(new Error('401: Unauthorized.'));
          } else if (error.response.status === 500) {
            actions.loadingError(new Error('500: Unexpected error.'));
          } else {
            actions.loadingError(new Error(`${error.response.status}: ${error.response.data.reason}.`));
          }
        } else if (error.request) {
          actions.loadingError(new Error('Unexpected error.'));
        } else {
          actions.loadingError(new Error(`${error.message}.`));
        }

        console.log(error);
      })
  }

  return (
        <form className='signin-form'>
          <Input
            type='text'
            name='login'
            id='login'
            placeholder='login'
            required={true}
            value={state.requestData.login}
            setValue={actions.setLogin}/>
          <Input
            type='password'
            name='password'
            id='password'
            placeholder='password'
            required={true}
            value={state.requestData.password}
            setValue={actions.setPassword}/>
          <button
            onClick={handleSignIn}
            disabled={state.loading}
            type={'button'}
            className={'button'}
          >
            <span className={'button-title'}>
              {'Sign in'}
            </span>
          </button>
          {state.error && (
            <div>{state.error.message}</div>
          )}
          <div className='sign-link'>
            <Link className='header-link' to={RoutePaths.SignUp}>I'm new here</Link>
          </div>
        </form>

  )
}
