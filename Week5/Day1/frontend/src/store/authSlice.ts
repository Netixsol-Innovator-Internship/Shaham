
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { api } from './api'
interface AuthState { token: string | null }
const initialState: AuthState = { token: typeof window === 'undefined' ? null : localStorage.getItem('token') }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
      if (typeof window !== 'undefined') {
        if (action.payload) localStorage.setItem('token', action.payload)
        else localStorage.removeItem('token')
      }
    }
  }
})
export const { setToken } = slice.actions
export default slice.reducer
