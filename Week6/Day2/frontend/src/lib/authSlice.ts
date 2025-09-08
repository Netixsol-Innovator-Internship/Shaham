import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Helper function to safely parse localStorage data
const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
            return null;
        }
        return JSON.parse(storedUser);
    } catch (error) {
        console.warn('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        return null;
    }
};

const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
        return null;
    }
    return token;
};

const initialState: AuthState = {
    user: getStoredUser(),
    token: getStoredToken(),
    isAuthenticated: typeof window !== 'undefined' ? !!getStoredToken() : false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.error = null;

            // Save to localStorage with error handling
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('token', action.payload.accessToken);
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                } catch (error) {
                    console.warn('Failed to save auth data to localStorage:', error);
                }
            }
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            
            // Update localStorage with new user data
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('user', JSON.stringify(action.payload));
                } catch (error) {
                    console.warn('Failed to update user data in localStorage:', error);
                }
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } catch (error) {
                    console.warn('Failed to clear localStorage:', error);
                }
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearError: (state) => {
            state.error = null;
        },

        updateLoyaltyPoints: (state, action: PayloadAction<number>) => {
            if (state.user) {
                state.user.loyaltyPoints = action.payload;
            }
        },
    },
});

export const {
    setCredentials,
    setUser,
    logout,
    setLoading,
    setError,
    clearError,
    updateLoyaltyPoints,
} = authSlice.actions;

export default authSlice.reducer;
