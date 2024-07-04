import { db } from '../config/firebase'
import { IUser } from '../types/User'
import {
  getDocs,
  collectionGroup,
  where,
  query,
} from 'firebase/firestore'
import { extractCardPath } from '../utils'
import { ITask } from '../types/Task'

export const getAllUserTasks = async (projectId: string, user: IUser): Promise<ITask[]> => {
  if (!user?.id) return []

  const queryTasks = query(collectionGroup(db, 'tasks'), where('users', 'array-contains', user.id))
  const snapshots = await getDocs(queryTasks)
  const tasks: ITask[] = []
  snapshots.forEach(
    (snap) =>
      snap.ref.path.includes(`projects/${projectId}`) &&
      tasks.push({ ...snap.data(), cardPath: extractCardPath(snap.ref.path) }),
  )

  return tasks
}
