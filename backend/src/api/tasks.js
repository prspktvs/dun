import { allQuery, getQuery } from '../database/index.js'
import {
  SELECT_USER_TASKS_QUERY,
  SELECT_PROJECT_TASKS_QUERY,
  SELECT_CARD_BY_ID_QUERY,
  SELECT_TASK_BY_ID,
  SELECT_PROJECT_ID_BY_TASK_ID,
} from '../database/queries.js'
import { sendMessageToProject } from '../server.js'
import { getCardById } from './cards.js'

function deserializeTask(task) {
  return {
    ...task,
    isDone: !!task?.isDone,
    users: JSON.parse(task?.users || '[]'),
  }
}

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId, isDone, offset = 0, limit = 50 } = req.query

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }

    const tasks = await allQuery(SELECT_PROJECT_TASKS_QUERY, [projectId, isDone, offset, limit])
    res.json({ tasks: tasks.map(deserializeTask) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getUserTasks = async (req, res) => {
  try {
    const { userId, projectId, includeCards } = req.query

    if (projectId && !userId) {
      return getProjectTasks(req, res)
    }

    if (!userId || !projectId) {
      return res.status(400).json({ error: 'userId and projectId are required' })
    }

    const tasks = await allQuery(SELECT_USER_TASKS_QUERY, [projectId, `%${userId}%`])
    res.json({ tasks: tasks.map(deserializeTask) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { isDone, text, users, author, priority, status, position, card_id } = req.body

    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' })
    }

    const updateQuery = `
      UPDATE tasks
      SET isDone = ?, text = ?, users = ?, author = ?, priority = ?, status = ?, position = ?, card_id = ?
      WHERE id = ?
    `
    await allQuery(updateQuery, [
      +isDone,
      text,
      JSON.stringify(users || []),
      author,
      priority,
      status,
      position,
      card_id,
      id,
    ])

    const task = await getQuery(SELECT_TASK_BY_ID, [id])
    const { project_id } = await getQuery(SELECT_PROJECT_ID_BY_TASK_ID, [id])

    if (task) {
      sendMessageToProject(project_id, {
        type: 'tasks',
        updatedTasks: [deserializeTask(task)],
      })
    }

    res.status(200).json({
      id,
      isDone,
      text,
      users,
      author,
      priority,
      status,
      position,
      card_id,
      message: 'Task updated successfully',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateTasksOrderBatch = async (req, res) => {
  try {
    const { tasks } = req.body
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ error: 'tasks array required' })
    }

    for (const task of tasks) {
      await allQuery(`UPDATE tasks SET position = ?, card_id = ?, status = ? WHERE id = ?`, [
        task.position,
        task.card_id,
        task.status,
        task.id,
      ])
    }

    const { project_id } = await getQuery(SELECT_PROJECT_ID_BY_TASK_ID, [tasks[0].id])

    sendMessageToProject(project_id, {
      type: 'tasks',
      updatedTasks: tasks,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('[updateTasksOrderBatch] Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
