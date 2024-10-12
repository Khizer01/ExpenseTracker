import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        resetError: (state) => {
            state.error = false;
        },
        changeLang: (state, action) => {
            state.currentUser.lang = action.payload;    
        }
}});

export const { loginStart, loginSuccess, loginFailure, logout, resetError, changeLang} = userSlice.actions;

export default userSlice.reducer;