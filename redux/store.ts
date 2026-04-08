import { configureStore } from "@reduxjs/toolkit"
import recipieReducer from './features/recipieSlice'
import convertionReducer from './features/conversionSlice'
import recipieListReducer from './features/recipieListSlice'
import { TypedUseSelectorHook, useSelector } from "react-redux"

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