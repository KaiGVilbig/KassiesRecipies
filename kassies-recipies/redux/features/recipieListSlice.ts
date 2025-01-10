import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { recipie } from '@/interfaces'
import { RootState } from "../store"

const initialState = {
    searchParam: "",
    addRecipieIsOpen: false,
    addConversionIsOpen: false,
    recipieIsOpen: false
}

export const listData = createSlice({
    name: "listData",
    initialState,
    reducers: {
        setSearchParam: (state, action: PayloadAction<string>) => {
            state.searchParam = action.payload;
        },
        setAddRecipieIsOpen: (state, action: PayloadAction<boolean>) => {
            state.addRecipieIsOpen = action.payload;
        },
        setAddConversionIsOpen: (state, action: PayloadAction<boolean>) => {
            state.addConversionIsOpen = action.payload;
        },
        setIsRecipieOpen: (state, action: PayloadAction<boolean>) => {
            state.recipieIsOpen = action.payload;
        }
    }
})
export const getSearchParam = (state: RootState) => state.recipieListReducer.searchParam;
export const getAddRecipieIsOpen = (state: RootState) => state.recipieListReducer.addRecipieIsOpen;
export const getAddConversionIsOpen = (state: RootState) => state.recipieListReducer.addConversionIsOpen;
export const getIsRecipieOpen = (state: RootState) => state.recipieListReducer.recipieIsOpen;

export const { setSearchParam, setAddRecipieIsOpen, setAddConversionIsOpen, setIsRecipieOpen } = listData.actions;
export default listData.reducer;