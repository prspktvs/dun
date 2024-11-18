import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { useLocation, useNavigate } from 'react-router-dom'

import { auth } from '../config/firebase'
import { getOrCreateUser } from '../services'
import { IUser } from '../types/User'
import { notifyError, notifySuccess } from '../utils/notifications'
import {
  EMAIL_EXISTS,
  EMAIL_IS_NOT_VERIFIED,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  USER_NOT_FOUND,
  WEAK_PASSWORD,
} from '../constants/errors'
import {
  EMAIL_NOT_VERIFIED_MESSAGE,
  EMAIL_VERIFIED_MESSAGE,
  LOGGED_IN_MESSAGE,
} from '../constants/messages'
import { registerForPushNotifications } from '../utils/push'

interface ILoginCredentials {
  email: string
  password: string
}
interface IRegisterCredentials extends ILoginCredentials {
  name: string
  cb?: () => void
}

interface AuthContextType {
  user: IUser | firebase.User | null
  isAuthenticated: boolean
  loading: boolean
  token: string
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  loginWithEmailAndPassword: (credentials: ILoginCredentials) => Promise<void>
  registerWithEmailAndPassword: (credentials: IRegisterCredentials) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const defaultValue = {
  isAuthenticated: false,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  registerWithEmailAndPassword: async () => {},
  loginWithEmailAndPassword: async () => {},
  forgotPassword: async () => {},
}

export const AuthContext = React.createContext<AuthContextType>(defaultValue)

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<firebase.User | IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: '/' } }

  const loginWithEmailAndPassword = async ({ email, password }: ILoginCredentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (!userCredential.user?.emailVerified) return notifyError(EMAIL_NOT_VERIFIED_MESSAGE)
      if (userCredential) {
        const userData = await getOrCreateUser(userCredential.user as firebase.User)
        setUser(userData)
      }

      notifySuccess(LOGGED_IN_MESSAGE)
      navigate(from)
    } catch (error) {
      console.error('Error signing in with email and password:', error)
      switch (error.code) {
        case INVALID_EMAIL:
          return notifyError('Invalid email')
        case INVALID_PASSWORD:
          return notifyError('Invalid password')
        case USER_NOT_FOUND:
          return notifyError('User not found')
        default:
          return notifyError('Error in login. Please try again.')
      }
    }
  }

  const registerWithEmailAndPassword = async ({
    email,
    password,
    name,
    cb,
  }: IRegisterCredentials) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      if (!userCredential) throw new Error('User not created')

      await getOrCreateUser({ ...userCredential.user, displayName: name } as firebase.User)

      await sendEmailVerification(userCredential.user)

      notifySuccess(EMAIL_VERIFIED_MESSAGE)

      if (cb) cb()
    } catch (error) {
      console.error('Error signing up with email and password:', error)
      switch (error.code) {
        case INVALID_EMAIL:
          return notifyError('Invalid email')
        case EMAIL_EXISTS:
          return notifyError('The email already used. Please try another one.')
        case WEAK_PASSWORD:
          return notifyError('Your password is too weak. Please try another one.')
        default:
          return notifyError('Error in registration. Please try again.')
      }
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    setLoading(true)

    try {
      await signInWithPopup(auth, provider)
      navigate(from)
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      if (!email) return notifyError('Please enter your email')
      await sendPasswordResetEmail(auth, email)

      notifySuccess('Password reset email sent on your email. Please check.')
    } catch (error) {
      console.error('Error forgot password:', error)
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error log out:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getOrCreateUser(user as firebase.User)
        setUser(userData)

        const token = await user.getIdToken()
        setToken(token)
        localStorage.setItem('token', token)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (token) {
      registerForPushNotifications(token)
    }
  }, [token])

  const value = {
    isAuthenticated: !!user,
    loading,
    user,
    token,
    signInWithGoogle,
    signOut,
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    forgotPassword,
  }

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
