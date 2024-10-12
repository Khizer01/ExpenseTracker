import { createSlice } from "@reduxjs/toolkit";

const ThemeReducer = createSlice({
    name: 'theme',
    initialState: {
        currentTheme: 'light'
    },
    reducers: {
        toggleTheme: (state) => {
            if(state.currentTheme === 'light'){
            state.currentTheme = 'dark';
        }
            else {
                state.currentTheme = 'light';
            }
        }
    }
})

export const { toggleTheme } = ThemeReducer.actions;
export default ThemeReducer.reducer;