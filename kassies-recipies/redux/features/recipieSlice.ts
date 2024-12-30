import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { recipie } from '@/interfaces'

type Recipies = {
    recipies: Array<recipie>
}

type InitialState = {
    value: Recipies
}

const initialState = {
    value: {
        recipies: []
    } as Recipies
} as InitialState

export const recipies = createSlice({
    name: "recipies",
    initialState,
    reducers: {
        setRecipies: (state, action: PayloadAction<Array<recipie>>) => {
            return {
                value: {
                    recipies: action.payload
                }
            }
        }
    }
})

export const { setRecipies } = recipies.actions;
export default recipies.reducer;