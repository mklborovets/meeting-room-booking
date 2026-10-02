import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;