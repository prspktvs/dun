import { allQuery } from '../database/index.js'
import { SELECT_USER_TASKS_QUERY } from '../database/queries.js'

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.query.userId
    const projectId = req.query.projectId

    if (!userId || !projectId) {
      res.status(400).send('userId and projectId are required')
      return
    }

    const tasks = await allQuery(SELECT_USER_TASKS_QUERY, [projectId, `%${userId}%`])
    res.json({ tasks })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}
