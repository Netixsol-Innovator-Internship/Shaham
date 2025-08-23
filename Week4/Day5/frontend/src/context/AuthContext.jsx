"use client"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
} from "../redux/apiSlice"
import {
  setCredentials,
  clearAuth,
  setRedirectUrl as setRedirectUrlAction,
  getAndClearRedirectUrl as getAndClearRedirectUrlAction,
  setUser,
} from "../redux/authSlice"
import { useEffect } from "react"

const AuthContext = createContext(null)

export const useAuth = () => {
  const dispatch = useDispatch()

  const authState = useSelector((s) => s.auth) || {}
  const {
    user = null,
    token = null,
    loading = false,
    redirectAfterLogin = null,
  } = authState

  const [loginMutation] = useLoginMutation()
  const [registerMutation] = useRegisterMutation()
  const navigate = useNavigate() 
  const { data: profileData, isFetching } = useProfileQuery(undefined, {
    skip: !token,
  })

  // Load profile if token exists
  useEffect(() => {
    if (profileData?.data?.user && !user) {
      dispatch(setUser(profileData.data.user))
    }
  }, [profileData, user, dispatch])

  const login = async (email, password) => {
    try {
      const res = await loginMutation({ email, password }).unwrap()
      dispatch(setCredentials(res))

      if (typeof window !== "undefined") {
        window.location.href = "/"
      }

      return { success: true, ...res }
    } catch (err) {
      console.error("Login error:", err)
      return {
        success: false,
        message: err?.data?.message || err?.error || "Login failed",
      }
    }
  }

  const register = async (payload) => {
    console.log("Register payload being sent:", payload)
    try {
      const res = await registerMutation(payload).unwrap()
      dispatch(setCredentials(res))
      return { success: true, ...res }
    } catch (err) {
      console.error("Register error:", err)
      return {
        success: false,
        message: err?.data?.message || err?.error || "Registration failed",
      }
    }
  }

  const logout = () => {
    dispatch(clearAuth())
    if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }

  const setRedirectUrl = (url) => {
    dispatch(setRedirectUrlAction(url))
  }

  const getAndClearRedirectUrl = () => {
    return dispatch(getAndClearRedirectUrlAction())
  }

  return {
    user,
    token,
    loading: loading || isFetching,
    login,
    register,
    logout,
    setRedirectUrl,
    getAndClearRedirectUrl,
    redirectAfterLogin,
  }
}

export const AuthProvider = ({ children }) => children
