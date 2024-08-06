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
import { apiRequest } from '../utils/api'

export const getAllUserTasks = async (projectId: string, user: IUser): Promise<ITask[]> => {
  if (!projectId || !user) {
    console.error('projectId or user is missing')
    return []
  }

  const { tasks } = await apiRequest<{ tasks: ITask[]}>(`tasks?projectId=${projectId}&userId=${user?.id}`)

  return tasks.map((task: ITask) => ({ ...task, cardPath: `${projectId}/cards/${task.card_id}` }))
}
