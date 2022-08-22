import { Dispatch, Reducer, useEffect, useReducer } from 'react';
import { getCurrentUser, UserResponse } from 'remoteApi/users';
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
        payload: { responseData },
      });
    },
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
