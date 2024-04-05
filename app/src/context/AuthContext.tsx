import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../config/firebase'
import firebase from 'firebase/compat/app'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getOrCreateUser } from '../services'
import { IUser } from '../types/User'
import { useLocation, useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: IUser | null
  isAuthenticated: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const defaultValue = {
  isAuthenticated: false,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
}

export const AuthContext = React.createContext<AuthContextType>(defaultValue)

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<firebase.User | IUser | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()
  const { from } = location.state || { from: { pathname: '/' } }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    setLoading(true)

    try {
      await signInWithPopup(auth, provider)
      console.log(from)
      navigate(from)
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error log out:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await getOrCreateUser(user)
        setUser(userData)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    isAuthenticated: !!user,
    loading,
    user,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
