import e from 'express'
import { allQuery } from '../database/index.js'
import { SELECT_USER_TASKS_QUERY, SELECT_PROJECT_TASKS_QUERY } from '../database/queries.js'

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId, isDone, offset = 0, limit = 50 } = req.query

    if (!projectId) {
      return res.status(400).send('projectId is required')
    }

    const tasks = await allQuery(SELECT_PROJECT_TASKS_QUERY, [projectId, isDone, offset, limit])
    res.json({ tasks })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}

export const getUserTasks = async (req, res) => {
  try {
    const { userId, projectId, includeCards } = req.query

    if (projectId && !userId) {
      return getProjectTasks(req, res)
    }

    if (!userId || !projectId) {
      return res.status(400).send('userId and projectId are required')
    }

    const tasks = await allQuery(SELECT_USER_TASKS_QUERY, [projectId, `%${userId}%`])
    res.json({ tasks })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { isDone, text, users, author, priority, status } = req.body

    if (!id) {
      return res.status(400).send('Task ID is required')
    }

    const updateQuery = `
      UPDATE tasks
      SET isDone = ?, text = ?, users = ?, author = ?, priority = ?, status = ?
      WHERE id = ?
    `
    await allQuery(updateQuery, [isDone, text, users, author, priority, status, id])

    res.status(200).send('Task updated successfully')
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}
