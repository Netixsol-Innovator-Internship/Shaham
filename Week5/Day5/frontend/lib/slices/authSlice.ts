'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = { token?: string | null, user?: any | null, loggedIn: boolean }
const initialState: AuthState = { token: null, user: null, loggedIn: false }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      state.loggedIn = !!action.payload
    },
    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.loggedIn = false;
    }
  }
})

export const { setToken, setUser, logout } = slice.actions
export default slice.reducer
