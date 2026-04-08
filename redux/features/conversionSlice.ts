import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { conversion } from '@/interfaces'
import { RootState } from "../store"

type Conversions = {
    conversions: Array<conversion>
}

type InitialState = {
    value: Conversions
}

const initialState = {
    value: {
        conversions: []
    } as Conversions
} as InitialState

export const conversions = createSlice({
    name: "conversions",
    initialState,
    reducers: {
        setConversions: (state, action: PayloadAction<Array<conversion>>) => {
            return {
                value: {
                    conversions: action.payload
                }
            }
        },
        addConversion: (state, action: PayloadAction<conversion>) => {
            state.value.conversions.push(action.payload);
        }
    }
})
export const getConversions = (state: RootState) => state.convertionReducer.value.conversions;

export const { setConversions, addConversion } = conversions.actions;
export default conversions.reducer;