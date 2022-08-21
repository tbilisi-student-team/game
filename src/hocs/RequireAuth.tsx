import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from 'AppContext';
import { RoutePaths } from 'types';

type RequireAuthProps = {
  children: React.ReactNode,
}

export function RequireAuth(
  {
    children
  }: RequireAuthProps
): JSX.Element {
  const {
    currentUser: [
      state,
    ]
  } = useAppContext();

  if (state.isLoading) {
    return (
      <h1>Loading...</h1>
    )
  }

  if (state.error) {


    return (
      <h1>{`Error: ${state.error.message}`}</h1>
    )
  }

  return (
    <>
      {state.data ? children : <Navigate to={RoutePaths.SignIn}/>}
    </>
  )
}
