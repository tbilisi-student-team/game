import { Dispatch, Reducer, useEffect, useReducer } from 'react';
import {
  ChangeUserPasswordRequest,
  ChangeUserAvatarRequest,
  ChangeUserProfileRequest,
  getCurrentUser,
  UserResponse,
} from 'remoteApi/users';
import * as API from 'remoteApi/users';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse } from 'remoteApi';

type State = {
  isLoading: boolean,
  error: Error | null,
  data: UserResponse | null
};

const INITIAL_STATE: State = {
  isLoading: true,
  error: null,
  data: null,
}

enum ActionType {
  LOADING_START = 'LOADING_START',
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SUCCESS = 'LOADING_SUCCESS',
}

type Messages = {
  [ActionType.LOADING_START]: undefined,
  [ActionType.LOADING_ERROR]: { error: Error },
  [ActionType.LOADING_SUCCESS]: { responseData: UserResponse },
}

type Actions = ActionTypeAndPayload<Messages>[keyof ActionTypeAndPayload<Messages>];

const reducer = (
  state: State,
  action: Actions,
): State => {
  switch (action.type) {
    case ActionType.LOADING_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ActionType.LOADING_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      }
    case ActionType.LOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload.responseData,
      }
    default: throw new Error('useSignUp reducer error.');
  }
}

function getActions(
  state: State,
  dispatch: Dispatch<Actions>,
) {

  function loadingStart() {
    dispatch({
      type: ActionType.LOADING_START,
    });
  }

  function loadingError(error: Error) {
    dispatch({
      type: ActionType.LOADING_ERROR,
      payload: { error },
    });
  }

  function loadingSuccess(responseData: UserResponse) {
    dispatch({
      type: ActionType.LOADING_SUCCESS,
      payload: { responseData },
    });
  }

  function changeUserAvatar(requestData: ChangeUserAvatarRequest) {
    loadingStart();

    API.changeUserProfileAvatar(requestData)
      .then((axiosResponse: AxiosResponse<UserResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          dispatch({
            type: ActionType.LOADING_SUCCESS,
            payload: { responseData }
          });

          console.log(state);
        }
        else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {//TODO DRY
        const actions = getActions(state, dispatch);

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
  }

  function changeUserPassword(requestData: ChangeUserPasswordRequest) {
    loadingStart();
  }

  function changeUserProfile(requestData: ChangeUserProfileRequest) {
    loadingStart();

    API.changeUserProfile(requestData)
      .then((axiosResponse: AxiosResponse<UserResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          dispatch({
            type: ActionType.LOADING_SUCCESS,
            payload: { responseData }
          });
        }
        else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        const actions = getActions(state, dispatch);

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
  }

  return {
    loadingStart,
    loadingError,
    loadingSuccess,
    changeUserAvatar,
    changeUserPassword,
    changeUserProfile,
  }
}

export function useCurrentUser(): [State, ReturnType<typeof getActions>] {
  const [
    state,
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, INITIAL_STATE);

  const actions = getActions(state, dispatch);

  useEffect(() => {
    dispatch({
      type: ActionType.LOADING_START,
    });

    getCurrentUser()
      .then((axiosResponse: AxiosResponse<UserResponse>) => {
        if (axiosResponse.status === 200) {
          const responseData = axiosResponse.data;

          dispatch({
            type: ActionType.LOADING_SUCCESS,
            payload: { responseData },
          });
        }
        else {
          throw new Error(`${axiosResponse.status}: Unexpected error.`);
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          if (error.response.status === 400) {
            dispatch({
              type: ActionType.LOADING_ERROR,
              payload: { error: new Error(`400: ${error.response.data.reason}.`) },
            });
          }
          else if (error.response.status === 401) {
            dispatch({
              type: ActionType.LOADING_ERROR,
              payload: { error: new Error('401: Unauthorized.') },
            });
          }
          else if (error.response.status === 500) {
            dispatch({
              type: ActionType.LOADING_ERROR,
              payload: { error: new Error('500: Unexpected error.') },
            });
          }
          else {
            dispatch({
              type: ActionType.LOADING_ERROR,
              payload: { error: new Error(`${error.response.status}: ${error.response.data.reason}.`) },
            });
          }
        }
        else if (error.request) {
          dispatch({
            type: ActionType.LOADING_ERROR,
            payload: { error: new Error('Unexpected error.') },
          });
        }
        else {
          dispatch({
            type: ActionType.LOADING_ERROR,
            payload: { error: new Error(`${error.message}.`) },
          });
        }

        console.error(error);
      });
  }, [])

  return [
    state,
    actions,
  ]
}
