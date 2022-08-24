import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { RoutePaths, Status } from 'types';
import { selectCurrentUserData, selectCurrentUserError, selectCurrentUserStatus } from 'pages/App/currentUserSlice';

type RequireAuthProps = {
  children: React.ReactNode,
}

export function RequireAuth(
  {
    children
  }: RequireAuthProps
): JSX.Element {
  const currentUserData = useSelector((rootState: RootState) => selectCurrentUserData(rootState.currentUser));
  const status = useSelector((rootState: RootState) => selectCurrentUserStatus(rootState.currentUser));
  const error = useSelector((rootState: RootState) => selectCurrentUserError(rootState.currentUser));

  console.log(status);

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

  if (currentUserData) {
    console.log(currentUserData);
  }

  return (
    <>
      {(status === Status.Fulfilled && !!currentUserData) ? children : <Navigate to={RoutePaths.SignIn}/>}
    </>
  )
}
