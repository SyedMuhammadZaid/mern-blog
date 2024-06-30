import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true,
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.loading = false,
            state.currentUser = action.payload
        },
        signInFailure: (state,action) => {
            state.loading = false,
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null
        },
        updateSuccess: (state,action) => {
            state.loading = false
            state.currentUser = action.payload
        },
        updateFailure: (state,action) => {
            state.loading = false,
            state.error = action.payload
        },
        deleteAccountStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteAccountSuccess: (state) => {
            state.loading = false
            state.currentUser = null
            state.error = null
        },
        deleteAccountFailure: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },
        signOut: (state) => {
            state.loading = false
            state.currentUser = null
            state.error = null
        }

    }
})

export const {signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure, deleteAccountStart, deleteAccountSuccess, deleteAccountFailure,signOut} = userSlice.actions;
export default userSlice.reducer
