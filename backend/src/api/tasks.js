import { runQuery } from '../database/index.js'
import { SELECT_ALL_CARDS_WITH_TASKS_AND_FILES_QUERY } from '../database/queries.js'

export const getTasksWithCards = async (req, res) => {
  try {
    const { projectId } = req.query

    if (!projectId) {
      return res.status(400).send('projectId is required')
    }

    const tasksWithCards = await runQuery(SELECT_ALL_CARDS_WITH_TASKS_AND_FILES_QUERY, [projectId])
    res.json({ tasksWithCards })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}
