/* eslint-disable react-hooks/rules-of-hooks */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '.';

export const useUnitDispatch = () => useDispatch<AppDispatch>();
export const useUnitSelector: TypedUseSelectorHook<AppState> = useSelector;
