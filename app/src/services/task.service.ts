
import { IUser } from '../types/User'
import { ITask } from '../types/Task'
import { apiRequest } from '../utils/api'
import { logAnalytics } from '../utils/analytics'
import { ANALYTIC_EVENTS } from '../constants/analytics.constants'

export const getAllUserTasks = async (projectId: string, user: IUser): Promise<ITask[]> => {
  if (!projectId || !user) return []

  const { tasks } = await apiRequest<{ tasks: ITask[]}>(`tasks?projectId=${projectId}&userId=${user?.id}`)

  return tasks.map((task: ITask) => ({ ...task, cardPath: `${projectId}/cards/${task.card_id}` }))
}

export const getProjectTasks = async (projectId: string, isDone: number = 1, offset: number = 0, limit: number = 100): Promise<ITask[]> => {
  if (!projectId) return []

  const { tasks } = await apiRequest<{ tasks: ITask[]}>(`tasks?projectId=${projectId}&isDone=${isDone}&offset=${offset}&limit=${limit}`)

  return tasks.map((task: ITask) => ({ ...task, cardPath: `${projectId}/cards/${task.card_id}` }))
}

export const updateTask = async (task: ITask, projectId: string): Promise<ITask> => {
  if (!task || !task.id) return task

  const { updatedTask } = await apiRequest<{ updatedTask: ITask }>(`tasks/${task.id}`, {
    method: 'POST',
    body: JSON.stringify(task),
  })

  const result = { ...updatedTask }
  if (result.id) {
  logAnalytics(ANALYTIC_EVENTS.TASK_UPDATED, { task_id: result.id, project_id: projectId, done: (result as unknown as { isDone?: boolean }).isDone })
  }
  return result
}