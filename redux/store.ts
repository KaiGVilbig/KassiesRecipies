import { configureStore, Action } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import recipieReducer from './features/recipieSlice'
import convertionReducer from './features/conversionSlice'
import recipieListReducer from './features/recipieListSlice'

export const store = configureStore({
    reducer: {
        recipieReducer,
        convertionReducer,
        recipieListReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type TypedUseDispatchHook = typeof useDispatch;
export const useAppDispatch: TypedUseDispatchHook = useDispatch;