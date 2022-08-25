import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { RequireAuth } from 'hocs';

import { RoutePaths } from 'types';

import { Forum, Game, Leaderboard, Main, NotFound, SignIn, SignUp, StartGame, User } from 'pages';

import '@fontsource/averia-serif-libre';

export function App () {
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

        <Route
          path={RoutePaths.User}
          element={<RequireAuth><User/></RequireAuth>}
        />
      </Routes>
    </>
  )
}
