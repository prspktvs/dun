import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import firebase from 'firebase/compat/app'

import { db } from '../config/firebase'
import { IUser } from '../types/User'

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
  }
  try {
    await setDoc(userRef, newUser)
  } catch (error) {
    console.error('Error creating user document', error)
  }

  return newUser
}

export const updateUser = async (user: IUser): Promise<void> => {
  const userRef = doc(collection(db, 'users'), user.id)

  try {
    await setDoc(userRef, user, { merge: true })
  } catch (error) {
    console.error('Error updating user document', error)
  }
}
