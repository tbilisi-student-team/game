import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePaths, Status } from 'types';
import { useAppSelector } from 'hooks';
import {
  selectCurrentUserData,
  selectCurrentUserError,
  selectCurrentUserStatus,
} from 'pages/App/currentUserSlice';

type RequireAuthProps = {
  children: React.ReactNode,
}

export function RequireAuth(
  {
    children
  }: RequireAuthProps
): JSX.Element {
  const currentUserData = useAppSelector((rootState) => selectCurrentUserData(rootState.currentUser));
  const status = useAppSelector((rootState) => selectCurrentUserStatus(rootState.currentUser));
  const error = useAppSelector((rootState) => selectCurrentUserError(rootState.currentUser));

  if (status === Status.Pending) {
    return (
      <h1>Pending...</h1>
    )
  }

  if (!!error?.message || status === Status.Rejected) {
    return (
      <h1>{`Error${error ? `: ${error.message}` : '.'}`}</h1>
    )
  }

  return (
    <>
      {(status === Status.Fulfilled && !!currentUserData) ? children : <Navigate to={RoutePaths.SignIn}/>}
    </>
  )
}
