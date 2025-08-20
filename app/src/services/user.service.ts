import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import firebase from 'firebase/compat/app'

import { db } from '../config/firebase'
import { IUser } from '../types/User'
import { logAnalytics } from '../utils/analytics'
import { ANALYTIC_EVENTS } from '../constants/analytics.constants'

export const getOrCreateUser = async (user: firebase.User): Promise<IUser | null> => {
  if (!user) return null

  const userRef = doc(collection(db, 'users'), user.uid)

  const userDoc = await getDoc(userRef)

  if (userDoc.exists()) {
    return userDoc.data() as IUser
  }
  const newUser = {
    id: user.uid,
    avatarUrl: user.photoURL || '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    email: user.email || '',
    name: user.displayName || 'User',
    lastProjectId: '',
  }
  await setDoc(userRef, newUser)
  logAnalytics(ANALYTIC_EVENTS.USER_CREATED, { user_id: newUser.id })

  return newUser
}

export const updateUser = async (user: IUser): Promise<void> => {
  const userRef = doc(collection(db, 'users'), user.id)

  await setDoc(userRef, user, { merge: true })
}
