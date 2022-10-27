import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AxiosError, AxiosResponse } from 'axios';

import { Input } from '@/ui/index';
import { RoutePaths } from '@/types/index'
import { useAppContext } from '@/appContext/index';

import {Layout} from "@/components/Layout";
import {useSession, signIn, SignInResponse as NextAuthSignInResponse} from "next-auth/react";
import {signin, SignInErrorResponse, SignInResponse} from "@/remoteAPI/auth";
import {getCurrentUser} from "@/remoteAPI/users";
import {GlobalServerSideProps} from "@/utils/getServerSideProps";


export default function SignIn(props: GlobalServerSideProps) {
  const nextRouter = useRouter();

  const {
    signIn: [ state, actions ],
  } = useAppContext();

  const { data: session } = useSession();

  const handleSignIn = () => {
    actions.loadingStart();
    signin(state.requestData)
      .then((axiosResponse: AxiosResponse<SignInResponse>) => {
        if (axiosResponse.status === 200) {
          getCurrentUser().then((res) => {
            const user = res.data;
            signIn('credentials', {...state.requestData, redirect: false}, `id=${user.id}`).then((res?: NextAuthSignInResponse) => {
              if (res?.ok) {
                actions.loadingSuccess('OK');
                nextRouter.push(RoutePaths.Game);
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
        }
        else {
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
    <Layout theme={props.theme} heading={'Sign in'} subheading={'Fill out the form'}>
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
        {session == null && <button
          type={'button'}
          className={'button'}
          title={'GitHub and Yandex'}
          onClick={() => {
             signIn('yandex', {callbackUrl: RoutePaths.Main});
          }}
        >
          <span className={'button-title'}><span style={{color: 'white', backgroundColor: 'red', borderRadius: '1em', width: '2em', height: '2em', display: 'inline-block', verticalAlign: 'middle'}}><span style={{lineHeight: '2em'}}>Я</span></span> Sign in with Yandex</span>
        </button>}
        {state.error && (
          <div>{state.error.message}</div>
        )}
        <div className='sign-link'>
          <Link href={RoutePaths.SignUp}><a className='header-link'>I&apos;m new here</a></Link>
        </div>

      </form>
    </Layout>
  )
}
