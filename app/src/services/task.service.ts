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
import { BACKEND_URL } from '../constants/app'

export const getAllUserTasks = async (projectId: string, user: IUser): Promise<ITask[]> => {
  if (!projectId || !user) {
    console.error('projectId or user is missing')
    return []
  }

  const res = await fetch(`${BACKEND_URL}/api/tasks?projectId=${projectId}&userId=${user?.id}`)
  const data = await res.json()

  return data.tasks.map((task: ITask) => ({ ...task, cardPath: `${projectId}/cards/${task.card_id}` }))
}
