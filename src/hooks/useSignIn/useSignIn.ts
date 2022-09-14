import { Dispatch, Reducer, useReducer } from 'react';
import { SignInRequest, SignInResponse } from '@/remoteAPI/index';

type State = {
  loading: boolean,
  error: Error | null,
  responseData: SignInResponse | null,
  requestData: SignInRequest,
}

const INITIAL_STATE: State = {
  loading: false,
  error: null,
  responseData: null,
  requestData: {
    login: '',
    password: '',
  },
}

enum ActionType {
  LOADING_START = 'LOADING_START',
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SUCCESS = 'LOADING_SUCCESS',

  SET_LOGIN = 'SET_LOGIN',
  SET_PASSWORD = 'SET_PASSWORD',
}

type Messages = {
  [ActionType.LOADING_START]: undefined,
  [ActionType.LOADING_ERROR]: { error: Error },
  [ActionType.LOADING_SUCCESS]: { responseData: SignInResponse },

  [ActionType.SET_LOGIN]: { login: SignInRequest['login'] },
  [ActionType.SET_PASSWORD]: { password: SignInRequest['password'] },
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
        loading: true,
        error: null,
      }
    case ActionType.LOADING_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      }
    case ActionType.LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        responseData: action.payload.responseData,
      }

    case ActionType.SET_LOGIN:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          login: action.payload.login,
        }
      }

    case ActionType.SET_PASSWORD:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          password: action.payload.password,
        }
      }

    default: throw new Error('useSignUp reducer error.');
  }
}

function getActions(
  state: State,
  dispatch: Dispatch<Actions>,
) {
  return {
    loadingStart() {
      dispatch({
        type: ActionType.LOADING_START,
      });
    },
    loadingError(error: Error) {
      dispatch({
        type: ActionType.LOADING_ERROR,
        payload: { error },
      });
    },
    loadingSuccess(responseData: SignInResponse) {
      dispatch({
        type: ActionType.LOADING_SUCCESS,
        payload: { responseData },
      });
    },
    setLogin(login: SignInRequest['login']) {
      dispatch({
        type: ActionType.SET_LOGIN,
        payload: { login },
      });
    },
    setPassword(password: SignInRequest['password']) {
      dispatch({
        type: ActionType.SET_PASSWORD,
        payload: { password },
      });
    },
  }
}

export function useSignIn(): [State, ReturnType<typeof getActions>] {
  const [
    state,
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, INITIAL_STATE);

  return [
    state,
    getActions(state, dispatch),
  ]
}
