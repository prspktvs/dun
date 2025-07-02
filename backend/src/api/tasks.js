import e from 'express'
import { allQuery } from '../database/index.js'
import { SELECT_USER_TASKS_QUERY, SELECT_PROJECT_TASKS_QUERY } from '../database/queries.js'

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId, isDone, offset = 0, limit = 50 } = req.query

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }

    const tasks = await allQuery(SELECT_PROJECT_TASKS_QUERY, [projectId, isDone, offset, limit])
    res.json({ tasks })
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
    res.json({ tasks })
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
      isDone,
      text,
      users,
      author,
      priority,
      status,
      position,
      card_id,
      id,
    ])

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

export const updateTaskOrder = async (req, res) => {
  try {
    const { id } = req.params
    const { order, card_id, status } = req.body

    console.log(
      `[updateTaskOrder] Task ${id}: order=${order}, card_id=${card_id}, status=${status}`,
    )

    let query
    let params

    if (card_id !== undefined && status !== undefined) {
      query = `
        UPDATE tasks
        SET position = ?, card_id = ?, status = ?
        WHERE id = ?
      `
      params = [order, card_id, status, id]
    } else {
      query = `
        UPDATE tasks
        SET position = ?
        WHERE id = ?
      `
      params = [order, id]
    }

    await allQuery(query, params)

    res.status(200).json({
      id,
      position: order,
      card_id,
      status,
      success: true,
    })
  } catch (error) {
    console.error('[updateTaskOrder] Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
