import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        id: null,
        email: null,
        phone: null,
        fullname: null,
        role: null,
        avatar: null,
    },
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAccount: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        doGetAccount: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload.user;
        },
        doLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                id: null,
                email: null,
                phone: null,
                fullname: null,
                role: null,
                avatar: null,
            };
        },
    },
});

export const { doLoginAccount, doGetAccount, doLogoutAction } = accountSlice.actions;
export default accountSlice.reducer;
