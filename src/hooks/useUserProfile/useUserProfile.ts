import { Dispatch, Reducer, useReducer } from 'react';
import {
  ChangeUserPasswordRequest,
  ChangeUserProfileRequest,
  UserResponse,
  changeUserProfile, changeUserProfileAvatar
} from 'remoteApi/users';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse } from 'remoteApi';

type State = {
  isLoading: boolean,
  error: Error | null,
  responseData: UserResponse | null,
  changeProfileRequest: ChangeUserProfileRequest,
  changePasswordRequest: ChangeUserPasswordRequest,
}

const INITIAL_STATE: State = {
  isLoading: false,
  error: null,
  responseData: null,
  changeProfileRequest: {
    first_name: '',
    second_name: '',
    login: '',
    email: '',
    phone: '',
    display_name: '',
  },
  changePasswordRequest: {
    oldPassword: '',
    newPassword: ''
  },
}

enum ActionType {
  LOADING_START = 'LOADING_START',
  LOADING_ERROR = 'LOADING_ERROR',
  LOADING_SUCCESS = 'LOADING_SUCCESS',

  SUBMIT_PROFILE = 'SUBMIT_PROFILE',

  SET_REQUEST = 'SET_REQUEST',
  SET_FIRST_NAME = 'SET_FIRST_NAME',
  SET_SECOND_NAME = 'SET_SECOND_NAME',
  SET_LOGIN = 'SET_LOGIN',
  SET_EMAIL = 'SET_EMAIL',
  SET_NEW_PASSWORD = 'SET_NEW_PASSWORD',
  SET_OLD_PASSWORD = 'SET_OLD_PASSWORD',
  SET_PHONE = 'SET_PHONE',
  SET_DISPLAY_NAME = 'SET_DISPLAY_NAME',
}

type Messages = {
  [ActionType.LOADING_START]: undefined,
  [ActionType.LOADING_ERROR]: { error: Error },
  [ActionType.LOADING_SUCCESS]: UserResponse,

  [ActionType.SUBMIT_PROFILE]: undefined,

  [ActionType.SET_REQUEST]: { requestData: ChangeUserProfileRequest },
  [ActionType.SET_FIRST_NAME]: { first_name: ChangeUserProfileRequest['first_name'] },
  [ActionType.SET_SECOND_NAME]: { second_name: ChangeUserProfileRequest['second_name'] },
  [ActionType.SET_LOGIN]: { login: ChangeUserProfileRequest['login'] },
  [ActionType.SET_EMAIL]: { email: ChangeUserProfileRequest['email'] },
  [ActionType.SET_NEW_PASSWORD]: { newPassword: ChangeUserPasswordRequest['newPassword'] },
  [ActionType.SET_OLD_PASSWORD]: { oldPassword: ChangeUserPasswordRequest['oldPassword'] },
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
        responseData: action.payload,
      }
    case ActionType.SUBMIT_PROFILE:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ActionType.SET_REQUEST:
      return {
        ...state,
        isLoading: false,
        changeProfileRequest: action.payload.requestData,
      }
    case ActionType.SET_FIRST_NAME:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          first_name: action.payload.first_name,
        },
      }
    case ActionType.SET_SECOND_NAME:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          second_name: action.payload.second_name,
        }
      }
    case ActionType.SET_LOGIN:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          login: action.payload.login,
        }
      }
    case ActionType.SET_EMAIL:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          email: action.payload.email,
        }
      }
    case ActionType.SET_DISPLAY_NAME:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          display_name: action.payload.display_name,
        }
      }
    case ActionType.SET_PHONE:
      return {
        ...state,
        changeProfileRequest: {
          ...state.changeProfileRequest,
          phone: action.payload.phone,
        }
      }
    default: throw new Error('useUserProfile reducer error.');
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
    loadingSuccess(responseData: UserResponse) {
      dispatch({
        type: ActionType.LOADING_SUCCESS,
        payload: responseData,
      });
    },
    changeProfile() {
      dispatch({
        type: ActionType.LOADING_START,
      });

      changeUserProfile(state.changeProfileRequest)
        .then((axiosResponse: AxiosResponse<UserResponse>) => {
          if (axiosResponse.status === 200) {
            const responseData = axiosResponse.data;

            dispatch({
              type: ActionType.LOADING_SUCCESS,
              payload: responseData
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
    },
    changeAvatar(formData: FormData) {
      dispatch({
        type: ActionType.LOADING_START,
      });

      changeUserProfileAvatar(formData)
        .then((axiosResponse: AxiosResponse<UserResponse>) => {
          if (axiosResponse.status === 200) {
            const responseData = axiosResponse.data;

            dispatch({
              type: ActionType.LOADING_SUCCESS,
              payload: responseData
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
    setPhone(phone: ChangeUserProfileRequest['phone']) {
      dispatch({
        type: ActionType.SET_PHONE,
        payload: { phone },
      });
    },
    setDisplayName(display_name: ChangeUserProfileRequest['display_name']) {
      dispatch({
        type: ActionType.SET_DISPLAY_NAME,
        payload: { display_name },
      });
    },
  }
}

export function useUserProfile(user: UserResponse): [State, ReturnType<typeof getActions>] {
  const initialState = { ...INITIAL_STATE, ...{ changeProfileRequest: user }, ...{ responseData: user } };

  Object.entries(initialState.changeProfileRequest).forEach(([ key, val ]) => {
    if (!val) {//TODO change UserResponse type as it can have nulls
      initialState.changeProfileRequest[key as keyof ChangeUserProfileRequest] = '';
    }
  });

  const [
    state,
    dispatch,
  ] = useReducer<Reducer<State, Actions>>(reducer, initialState);

  return [
    state,
    getActions(state, dispatch),
  ]
}
