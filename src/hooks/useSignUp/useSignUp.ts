import { Dispatch, Reducer, useReducer } from 'react';
import { SignUpRequest, SignUpResponse } from '@/remoteAPI/index';

type State = {
  loading: boolean,
  error: Error | null,
  responseData: SignUpResponse | null,
  requestData: SignUpRequest,
}

const INITIAL_STATE: State = {
  loading: false,
  error: null,
  responseData: null,
  requestData: {
    first_name: '',
    second_name: '',
    login: '',
    email: '',
    password: '',
    phone: '',
  },
}

enum ActionType {
  LOADING_START = 'LOADING_START',
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SUCCESS = 'LOADING_SUCCESS',

  SET_FIRST_NAME = 'SET_FIRST_NAME',
  SET_SECOND_NAME = 'SET_SECOND_NAME',
  SET_LOGIN = 'SET_LOGIN',
  SET_EMAIL = 'SET_EMAIL',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_PHONE = 'SET_PHONE',
}

type Messages = {
  [ActionType.LOADING_START]: undefined,
  [ActionType.LOADING_ERROR]: { error: Error },
  [ActionType.LOADING_SUCCESS]: { responseData: SignUpResponse },

  [ActionType.SET_FIRST_NAME]: { first_name: SignUpRequest['first_name'] },
  [ActionType.SET_SECOND_NAME]: { second_name: SignUpRequest['second_name'] },
  [ActionType.SET_LOGIN]: { login: SignUpRequest['login'] },
  [ActionType.SET_EMAIL]: { email: SignUpRequest['email'] },
  [ActionType.SET_PASSWORD]: { password: SignUpRequest['password'] },
  [ActionType.SET_PHONE]: { phone: SignUpRequest['phone'] },
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
    case ActionType.SET_FIRST_NAME:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          first_name: action.payload.first_name,
        },
      }
    case ActionType.SET_SECOND_NAME:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          second_name: action.payload.second_name,
        }
      }
    case ActionType.SET_LOGIN:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          login: action.payload.login,
        }
      }
    case ActionType.SET_EMAIL:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          email: action.payload.email,
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
    case ActionType.SET_PHONE:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          phone: action.payload.phone,
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
    loadingSuccess(responseData: SignUpResponse) {
      dispatch({
        type: ActionType.LOADING_SUCCESS,
        payload: { responseData },
      });
    },
    setFirstName(first_name: SignUpRequest['first_name']) {
      dispatch({
        type: ActionType.SET_FIRST_NAME,
        payload: { first_name },
      });
    },
    setSecondName(second_name: SignUpRequest['second_name']) {
      dispatch({
        type: ActionType.SET_SECOND_NAME,
        payload: { second_name },
      });
    },
    setLogin(login: SignUpRequest['login']) {
      dispatch({
        type: ActionType.SET_LOGIN,
        payload: { login },
      });
    },
    setEmail(email: SignUpRequest['email']) {
      dispatch({
        type: ActionType.SET_EMAIL,
        payload: { email },
      });
    },
    setPassword(password: SignUpRequest['password']) {
      dispatch({
        type: ActionType.SET_PASSWORD,
        payload: { password },
      });
    },
    setPhone(phone: SignUpRequest['phone']) {
      dispatch({
        type: ActionType.SET_PHONE,
        payload: { phone },
      });
    },
  }
}

export function useSignUp(): [State, ReturnType<typeof getActions>] {
  const [
    state,
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, INITIAL_STATE);

  return [
    state,
    getActions(state, dispatch),
  ]
}
