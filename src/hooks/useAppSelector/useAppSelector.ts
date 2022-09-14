import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { RootState } from '@/reduxStore/index';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
