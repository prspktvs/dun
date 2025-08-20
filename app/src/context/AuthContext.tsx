import React, { useContext, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth'
import { useLocation, useNavigate } from 'react-router-dom'

import { auth } from '../config/firebase'
import { getOrCreateUser } from '../services'
import { sendGreetingEmail } from '../utils/api'
import { IUser } from '../types/User'
import { notifyError, notifySuccess } from '../utils/notifications'
import {
  EMAIL_EXISTS,
  EMAIL_IS_NOT_VERIFIED,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  USER_NOT_FOUND,
  WEAK_PASSWORD,
} from '../constants/errors.constants'
import {
  EMAIL_NOT_VERIFIED_MESSAGE,
  EMAIL_VERIFIED_MESSAGE,
  LOGGED_IN_MESSAGE,
} from '../constants/messages.constants'
import { registerForPushNotifications } from '../utils/push'
import { genId } from '../utils'
import { ROUTES } from '../constants'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface ILoginCredentials {
  email: string
  password: string
}
interface IRegisterCredentials extends ILoginCredentials {
  name: string
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
  token: '',
  signInWithGoogle: async () => {},
  signOut: async () => {},
  registerWithEmailAndPassword: async () => {},
  loginWithEmailAndPassword: async () => {},
  forgotPassword: async () => {},
} as AuthContextType

export const AuthContext = React.createContext<AuthContextType>(defaultValue)

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<firebase.User | IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const { isMobile } = useBreakpoint()

  const navigate = useNavigate()
  const location = useLocation()
  const from = isMobile
    ? { pathname: ROUTES.DASHBOARD }
    : location.state?.from || { pathname: ROUTES.DASHBOARD }

  const loginWithEmailAndPassword = async ({ email, password }: ILoginCredentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if (userCredential) {
        const userData = await getOrCreateUser(userCredential.user as firebase.User)
        setUser(userData)
      }

      notifySuccess(LOGGED_IN_MESSAGE)
      navigate(from, { replace: true })
    } catch (error) {
      const err = error as any
      switch (err.code) {
        case INVALID_EMAIL:
          notifyError('Invalid email')
          break
        case INVALID_PASSWORD:
          notifyError('Invalid password')
          break
        case USER_NOT_FOUND:
          notifyError('User not found')
          break
        default:
          notifyError('Error in login. Please try again.')
      }
    }
  }

  const registerWithEmailAndPassword = async ({ email, password, name }: IRegisterCredentials) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      if (!userCredential) throw new Error('User not created')

      await getOrCreateUser({ ...userCredential.user, displayName: name } as firebase.User)

      // fire and forget greeting email
      sendGreetingEmail(email, name).catch(() => {})

      await sendEmailVerification(userCredential.user)

      notifySuccess(EMAIL_VERIFIED_MESSAGE)

      navigate(from, { replace: true })
    } catch (error) {
      const err = error as any
      switch (err.code) {
        case INVALID_EMAIL:
          notifyError('Invalid email')
          break
        case EMAIL_EXISTS:
          notifyError('The email already used. Please try another one.')
          break
        case WEAK_PASSWORD:
          notifyError('Your password is too weak. Please try another one.')
          break
        default:
          notifyError('Error in registration. Please try again.')
      }
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    setLoading(true)
    try {
      const cred = await signInWithPopup(auth, provider)
      const info = getAdditionalUserInfo(cred)
      if (info?.isNewUser && cred.user?.email) {
        sendGreetingEmail(cred.user.email, cred.user.displayName || undefined).catch(() => {})
      }
      navigate(from, { replace: true })
    } catch (_e) {}
  }

  const forgotPassword = async (email: string) => {
    try {
      if (!email) {
        notifyError('Please enter your email')
        return
      }
      await sendPasswordResetEmail(auth, email)

      notifySuccess('Password reset email sent on your email. Please check.')
    } catch (_e) {}
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
      navigate('/login', { replace: true, state: {} })
    } catch (_e) {}
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getOrCreateUser(user as firebase.User)
        setUser(userData)

        const token = await user.getIdToken()
        localStorage.setItem('token', token)
        setToken(token)
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

  const value: AuthContextType = {
    isAuthenticated: !!user,
    loading,
    user,
    token: token || '',
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
