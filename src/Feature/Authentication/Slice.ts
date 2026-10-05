import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthTokens } from '../../types/Auth.type';

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

// Safely load initial auth state from localStorage
const getInitialState = (): AuthState => {
    try {
        const adminAuth = localStorage.getItem('adminAuth') === 'true';
        if (!adminAuth) {
            return {
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            };
        }

        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        return {
            user,
            accessToken,
            refreshToken,
            isAuthenticated: !!accessToken,
        };
    } catch (error) {
        console.error('Failed to parse auth state from localStorage:', error);
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        };
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>
        ) => {
            const { user, tokens } = action.payload;
            state.user = user;
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
            state.isAuthenticated = true;

            // Persist to localStorage to remain compatible with existing ProtectedRoute and keep session
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        updateAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
        },
        logOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            // Clean up localStorage
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, updateAccessToken, logOut } = authSlice.actions;

export default authSlice.reducer;
