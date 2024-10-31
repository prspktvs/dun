import { runQuery, allQuery } from '../database/index.js'
import { SELECT_USER_TASKS_QUERY, SELECT_TASKS_WITH_CARDS_QUERY } from '../database/queries.js'

export const getUserTasks = async (req, res) => {
  try {
    const { userId, projectId, includeCards } = req.query

    if (!userId || !projectId) {
      return res.status(400).send('userId and projectId are required')
    }

    if (includeCards === 'true') {
      return getTasksWithCards(req, res)
    }

    const tasks = await allQuery(SELECT_USER_TASKS_QUERY, [projectId, `%${userId}%`])
    res.json({ tasks })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}
