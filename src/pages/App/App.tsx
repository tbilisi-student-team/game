import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { RoutePaths } from 'types';

import { Forum, Game, Leaderboard, Main, NotFound, SignIn, SignUp, StartGame, User } from 'pages';

import { useAppContext } from 'AppContext';
import { getCurrentUser, UserResponse, ErrorResponse } from 'remoteApi';
import { AxiosError, AxiosResponse } from 'axios';

import '@fontsource/averia-serif-libre';

export function App () {
  const {
    currentUser: [ , actions ],
  } = useAppContext();

  useEffect(() => {
    actions.loadingStart();
    getCurrentUser()
      .then((axiosResponse: AxiosResponse<UserResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          actions.loadingSuccess(responseData);
        }
        else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          if (error.response.status === 400) {
            actions.loadingError(new Error(`400: ${error.response.data.reason}.`));
          }
          else if (error.response.status === 401) {
            actions.loadingError(new Error('401: Unauthorized.'));
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
  }, [])

  return (
    <>
      <Routes>
        <Route path={'/'} element={<Navigate to={RoutePaths.Main}/>}/>

        <Route path={RoutePaths.Forum} element={<Forum/>}/>

        <Route path={RoutePaths.Game} element={<Game/>}/>

        <Route path={RoutePaths.StartGame} element={<StartGame/>}/>

        <Route path={RoutePaths.Leaderboard} element={<Leaderboard/>}/>

        <Route path={RoutePaths.Main} element={<Main/>}/>

        <Route path={RoutePaths.NotFound} element={<NotFound/>}/>

        <Route path={RoutePaths.SignIn} element={<SignIn/>}/>

        <Route path={RoutePaths.SignUp} element={<SignUp/>}/>

        <Route path={RoutePaths.User} element={<User/>}/>

        <Route path={`${RoutePaths.User}/:id`} element={<User/>}/>
      </Routes>
    </>
  )
}
