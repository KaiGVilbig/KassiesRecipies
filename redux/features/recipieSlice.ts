import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { recipie } from '@/interfaces'
import { RootState } from "../store"

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
        },
        addRecipie: (state, action: PayloadAction<recipie>) => {
            state.value.recipies.push(action.payload);
        },
        modifyRecipie: (state, action: PayloadAction<recipie>) => {
            const index = state.value.recipies.findIndex((r) => r._id === action.payload._id)
            if (index !== -1) { 
                state.value.recipies[index] = action.payload
            }
        },
        deleteRecipie: (state, action: PayloadAction<string>) => {
            const index = state.value.recipies.findIndex((r) => r._id === action.payload)
            if (index !== -1) {
                state.value.recipies.splice(index, 1)
            }
        }
    }
})
export const getRecipies = (state: RootState) => state.recipieReducer.value.recipies;

export const { setRecipies, addRecipie, modifyRecipie, deleteRecipie } = recipies.actions;
export default recipies.reducer;