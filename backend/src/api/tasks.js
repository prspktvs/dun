import { allQuery } from '../database/index.js'
import { SELECT_USER_TASKS_QUERY } from '../database/queries.js'

export const getUserTasks = async (req, res) => {
  try {
    const { userId, projectId } = req.query

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
