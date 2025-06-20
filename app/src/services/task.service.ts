
import { IUser } from '../types/User'
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

export const getProjectTasks = async (projectId: string, isDone: number = 1, offset: number = 0, limit: number = 100): Promise<ITask[]> => {
  if (!projectId) {
    console.error('projectId is missing')
    return []
  }

  const { tasks } = await apiRequest<{ tasks: ITask[]}>(`tasks?projectId=${projectId}&isDone=${isDone}&offset=${offset}&limit=${limit}`)

  return tasks.map((task: ITask) => ({ ...task, cardPath: `${projectId}/cards/${task.card_id}` }))
}

export const updateTask = async (task: ITask, projectId: string): Promise<ITask> => {
  if (!task || !task.id) {
    console.error('Task or task ID is missing')
    return task
  }

  const { updatedTask } = await apiRequest<{ updatedTask: ITask }>(`tasks/${task.id}`, {
    method: 'POST',
    body: JSON.stringify(task),
  })

  return { ...updatedTask, cardPath: `${projectId}/cards/${updatedTask.card_id}` }
}