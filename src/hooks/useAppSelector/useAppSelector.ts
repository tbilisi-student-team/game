import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from 'reduxStore';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
