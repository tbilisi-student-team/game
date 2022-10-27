import React  from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AxiosError, AxiosResponse } from 'axios';

import { Input } from '@/ui/index';
import { RoutePaths } from '@/types/index'
import { useAppContext } from '@/appContext/index';
import {getCurrentUser, signup, SignUpErrorResponse, SignUpResponse} from '@/remoteAPI/index';
import {Layout} from "@/components/Layout";
import {GlobalServerSideProps} from "@/utils/getServerSideProps";
import {signIn} from "next-auth/react";
import {SignInResponse as NextAuthSignInResponse} from "next-auth/react/types";

export default function SignUp (props: GlobalServerSideProps) {
  const nextRouter = useRouter();

  const {
    signUp: [ state, actions ],
    signIn: [ signInState, signInActions ],
    currentUser: [ currentUserState, currentUserActions ]
  } = useAppContext();

  const handleSignUp = () => {
    actions.loadingStart();

    signup(state.requestData)
      .then((axiosResponse: AxiosResponse<SignUpResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          actions.loadingSuccess(responseData);

          getCurrentUser().then((res) => {
            const user = res.data;
            currentUserActions.loadingSuccess(user);
            signIn('credentials', {...state.requestData, redirect: false}, `id=${user.id}`).then((res?: NextAuthSignInResponse) => {
              if (res?.ok) {
                signInActions.loadingSuccess('OK');
                nextRouter.push(RoutePaths.User);
              }
              else {
                console.error(res);
                const error = res?.error || 'Unknown error';
                actions.loadingError(Error(error));
              }
            }).catch((reason) => {
              console.error(reason);
              actions.loadingError(reason);
            });
          }).catch((reason) => {
            console.error(reason);
            actions.loadingError(reason);
          });
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
    <Layout theme={props.theme} heading={'Sign up'} subheading={'Fill out the form'}>
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
            <Link href={RoutePaths.SignIn}><a className='header-link'>I already have an account</a></Link>
          </div>
        </form>
      )}
    </Layout>
  )
}
