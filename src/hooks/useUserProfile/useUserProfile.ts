import { Dispatch, Reducer, useReducer } from 'react';
import { ChangeUserProfileRequest, ChangeUserProfileResponse } from 'remoteApi/users';

type State = {
  loading: boolean,
  error: Error | null,
  responseData: ChangeUserProfileResponse | null,
  requestData: ChangeUserProfileRequest,
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
    phone: '',
    display_name: '',
  },
}

enum ActionType {
  LOADING_START = 'LOADING_START',
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SUCCESS = 'LOADING_SUCCESS',

  SET_REQUEST = 'SET_REQUEST',
  SET_FIRST_NAME = 'SET_FIRST_NAME',
  SET_SECOND_NAME = 'SET_SECOND_NAME',
  SET_LOGIN = 'SET_LOGIN',
  SET_EMAIL = 'SET_EMAIL',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_PHONE = 'SET_PHONE',
  SET_DISPLAY_NAME = 'SET_DISPLAY_NAME',
}

type Messages = {
  [ActionType.LOADING_START]: undefined,
  [ActionType.LOADING_ERROR]: { error: Error },
  [ActionType.LOADING_SUCCESS]: { responseData: ChangeUserProfileResponse },

  [ActionType.SET_REQUEST]: { requestData: ChangeUserProfileRequest },
  [ActionType.SET_FIRST_NAME]: { first_name: ChangeUserProfileRequest['first_name'] },
  [ActionType.SET_SECOND_NAME]: { second_name: ChangeUserProfileRequest['second_name'] },
  [ActionType.SET_LOGIN]: { login: ChangeUserProfileRequest['login'] },
  [ActionType.SET_EMAIL]: { email: ChangeUserProfileRequest['email'] },
  [ActionType.SET_DISPLAY_NAME]: { display_name: ChangeUserProfileRequest['display_name'] },
  [ActionType.SET_PHONE]: { phone: ChangeUserProfileRequest['phone'] },
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
    case ActionType.SET_REQUEST:
      return {
        ...state,
        loading: false,
        requestData: action.payload.requestData,
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
    case ActionType.SET_DISPLAY_NAME:
      return {
        ...state,
        requestData: {
          ...state.requestData,
          display_name: action.payload.display_name,
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
    loadingSuccess(responseData: ChangeUserProfileResponse) {
      dispatch({
        type: ActionType.LOADING_SUCCESS,
        payload: { responseData },
      });
    },
    setRequest(requestData: ChangeUserProfileRequest) {
      dispatch({
        type: ActionType.SET_REQUEST,
        payload: { requestData },
      });
    },
    setFirstName(first_name: ChangeUserProfileRequest['first_name']) {
      dispatch({
        type: ActionType.SET_FIRST_NAME,
        payload: { first_name },
      });
    },
    setSecondName(second_name: ChangeUserProfileRequest['second_name']) {
      dispatch({
        type: ActionType.SET_SECOND_NAME,
        payload: { second_name },
      });
    },
    setLogin(login: ChangeUserProfileRequest['login']) {
      dispatch({
        type: ActionType.SET_LOGIN,
        payload: { login },
      });
    },
    setEmail(email: ChangeUserProfileRequest['email']) {
      dispatch({
        type: ActionType.SET_EMAIL,
        payload: { email },
      });
    },
    setPassword(display_name: ChangeUserProfileRequest['display_name']) {
      dispatch({
        type: ActionType.SET_DISPLAY_NAME,
        payload: { display_name },
      });
    },
    setPhone(phone: ChangeUserProfileRequest['phone']) {
      dispatch({
        type: ActionType.SET_PHONE,
        payload: { phone },
      });
    },
  }
}

export function useUserProfile(): [State, ReturnType<typeof getActions>] {
  const [
    state,
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, INITIAL_STATE);

  return [
    state,
    getActions(state, dispatch),
  ]
}
