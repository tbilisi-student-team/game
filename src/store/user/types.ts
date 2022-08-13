import { UserData } from '../../remoteApi/Auth';

export type UserState = {
  data: UserData | null;
  loading: boolean;
};
