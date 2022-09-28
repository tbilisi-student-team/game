import {reduxStore} from '../reduxStore';

export type RootState = ReturnType<typeof reduxStore.getState>;
