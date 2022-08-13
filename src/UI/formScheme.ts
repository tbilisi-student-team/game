import { ValidationType } from '../components/utils/validation';

export enum InputNames {
  FIRST_NAME = 'firstName',
  EMAIL = 'email',
  SECOND_NAME = 'secondName',
  DISPLAY_NAME = 'displayName',
  PHONE = 'phone',
  PASSWORD = 'password',
  LOGIN = 'login',
  OLD_PASSWORD = 'oldPassword',
  NEW_PASSWORD = 'newPassword',
  REPEAT_PASSWORD = 'repeatPassword',
  AVATAR = 'avatar',
}

export const formScheme: Record<InputNames, { name: string; type: ValidationType }> = {
  [InputNames.LOGIN]: {
    name: 'login',
    type: 'login',
  },
  [InputNames.EMAIL]: {
    name: 'email',
    type: 'email',
  },
  [InputNames.FIRST_NAME]: {
    name: 'first_name',
    type: 'shortText',
  },
  [InputNames.SECOND_NAME]: {
    name: 'second_name',
    type: 'shortText',
  },
  [InputNames.PHONE]: {
    name: 'phone',
    type: 'phone',
  },
  [InputNames.PASSWORD]: {
    name: 'password',
    type: 'password',
  },
  [InputNames.REPEAT_PASSWORD]: {
    name: 'repeat_password',
    type: 'equal',
  },
  [InputNames.OLD_PASSWORD]: {
    name: 'old_password',
    type: 'password',
  },

  [InputNames.DISPLAY_NAME]: {
    name: 'display_name',
    type: 'shortText',
  },
  [InputNames.NEW_PASSWORD]: {
    name: 'new_password',
    type: 'password',
  },
  [InputNames.AVATAR]: {
    name: 'avatar',
    type: 'file',
  },
};
