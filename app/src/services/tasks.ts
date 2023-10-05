import { IUser } from '../types/User'
import { db } from './firebaseDatabase'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  collectionGroup,
  where,
  query,
} from 'firebase/firestore'

export const getAllUserTasks = async (projectId: string, user: IUser) => {
  const { id } = user

  if (!id) return []

  const queryTasks = query(collectionGroup(db, 'tasks'), where('users', 'array-contains', id))
  const snapshots = await getDocs(queryTasks)
  const tasks: unknown[] = []
  snapshots.forEach(
    (snap) => snap.ref.path.includes(`projects/${projectId}`) && tasks.push(snap.data()),
  )

  return tasks
}
