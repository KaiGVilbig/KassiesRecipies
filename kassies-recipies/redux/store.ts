import { configureStore } from "@reduxjs/toolkit"
import recipieReducer from './features/recipieSlice'
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
    reducer: {
        recipieReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;