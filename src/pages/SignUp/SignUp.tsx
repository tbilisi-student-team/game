import React  from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../../UI/Header';
import Input from '../../UI/Input';

import { RoutePaths } from 'types'
import { useAppContext } from 'AppContext';
import { signup, SignUpErrorResponse, SignUpResponse } from 'remoteApi';
import { AxiosError, AxiosResponse } from 'axios';

import buddy1 from '../../assets/buddy-1.png';
import buddy2 from '../../assets/buddy-2-otr.png';


export function SignUp () {
  const navigate = useNavigate();

  const {
    signUp: [ state, actions ],
  } = useAppContext();

  const handleSignUp = () => {
    actions.loadingStart();

    signup(state.requestData)
      .then((axiosResponse: AxiosResponse<SignUpResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          actions.loadingSuccess(responseData);

          navigate(`${RoutePaths.User}/${responseData.id}`);
        } else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<SignUpErrorResponse>) => {
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
    <div className='wrapper'>
      <Header/>
      <div className='main'>
        <h2>
          Registration
        </h2>
        <div className='main__container'>
          <div className='left-character-wrapper left-character-wrapper__signinup'>
            <img src={buddy1} alt='Buddy One' className='left-character'/>
          </div>

          {state.loading ? (
            <div>Loading...</div>
          ) : (
            <form className='signinup-form'>
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

              <Input
                type='password'
                id='password'
                name='password'
                placeholder='password'
                required={true}
                value={state.requestData.password}
                setValue={actions.setPassword}/>

              <button
                onClick={handleSignUp}
                disabled={state.loading}
                type='button'
                className='button'
              >
                <span className='button-title'>
                Sign up
                </span>
              </button>

              {state.error && (
                <div>{state.error.message}</div>
              )}

              <div className='sign-link'>
                <Link className='header-link' to={RoutePaths.SignIn}>{'I already have an account'}</Link>
              </div>
            </form>
          )}
          <div className='right-character-wrapper  right-character-wrapper__signinup'>
            <img src={buddy2} alt='Buddy Two' className='right-character' />
          </div>
        </div>
      </div>

    </div>
  )
}
