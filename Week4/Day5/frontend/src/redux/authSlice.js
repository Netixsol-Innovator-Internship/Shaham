import { createSlice } from '@reduxjs/toolkit'

// ✅ Safe token retrieval
const tokenFromStorage =
  (typeof window !== 'undefined') ? localStorage.getItem('token') : null

// ✅ Safe JSON parse for user
let userFromStorage = null
if (typeof window !== 'undefined') {
  try {
    const rawUser = localStorage.getItem('user')
    userFromStorage = rawUser ? JSON.parse(rawUser) : null
  } catch (err) {
    console.warn("Invalid user data in localStorage, clearing it.")
    localStorage.removeItem('user')
    userFromStorage = null
  }
}

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage || null,
  loading: false,
  redirectAfterLogin: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user

      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('token', token)
        }
        if (user) {
          try {
            localStorage.setItem('user', JSON.stringify(user))
          } catch {
            console.warn("Failed to save user to localStorage")
          }
        }
      }
    },
    clearAuth: (state) => {
      state.token = null
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('redirectAfterLogin')
      }
    },
    setRedirectUrl: (state, action) => {
      state.redirectAfterLogin = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', action.payload || '')
      }
    },
    getAndClearRedirectUrl: (state) => {
      const url =
        state.redirectAfterLogin ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('redirectAfterLogin')
          : null)

      state.redirectAfterLogin = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('redirectAfterLogin')
      }
      return url
    },
    setUser: (state, action) => {
      state.user = action.payload
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('user', JSON.stringify(action.payload))
        } catch {
          console.warn("Failed to save user to localStorage")
        }
      }
    },
  },
})

export const {
  setCredentials,
  clearAuth,
  setRedirectUrl,
  getAndClearRedirectUrl,
  setUser,
} = authSlice.actions

export default authSlice.reducer
