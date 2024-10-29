import { runQuery, allQuery } from '../database/index.js';
import { SELECT_USER_TASKS_QUERY, SELECT_TASKS_WITH_CARDS_QUERY } from '../database/queries.js';

export const createTask = async (req, res) => {
  try {
    const { id, text, card_id, priority, status, isDone = 0 } = req.body;
    const query = `
      INSERT INTO tasks (id, isDone, text, card_id, priority, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await runQuery(query, [id, isDone, text, card_id, priority, status]);
    res.json({ message: 'Task successfully created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const { userId, projectId, includeCards } = req.query;

    if (!userId || !projectId) {
      return res.status(400).send('userId and projectId are required');
    }

    if (includeCards === 'true') {
      return getTasksWithCards(req, res);
    }

    const tasks = await allQuery(SELECT_USER_TASKS_QUERY, [projectId, `%${userId}%`]);
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const getTasksWithCards = async (req, res) => {
  try {
    const { projectId } = req.query;
    const tasks = await allQuery(SELECT_TASKS_WITH_CARDS_QUERY, [projectId]);
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
