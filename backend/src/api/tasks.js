import { runQuery, allQuery } from '../database/index.js';
import { SELECT_USER_TASKS_QUERY } from '../database/queries.js';

export const createTask = async (req, res) => {
  try {
    const { id, text, card_id, priority, status, isDone = 0 } = req.body;  
    const query = 
      `INSERT INTO tasks (id, isDone, text, card_id, priority, status) 
      VALUES (?, ?, ?, ?, ?, ?)`
    ;
    console.log(query, [id, isDone, text, card_id, priority, status]);
    await runQuery(query, [id, isDone, text, card_id, priority, status]);  

    res.json({ message: 'Task successfully created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.query.userId;
    const projectId = req.query.projectId;

    if (!userId || !projectId) {
      res.status(400).send('userId and projectId are required');
      return;
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
    const projectId = req.params.projectId;  // Получите projectId из параметров

    const query = `
      SELECT 
        tasks.*, 
        cards.title AS card_title 
      FROM 
        tasks 
      LEFT JOIN 
        cards ON tasks.card_id = cards.id 
      WHERE 
        cards.project_id = ?
    `;

    const tasks = await allQuery(query, [projectId]);  
    res.json({ tasks });  
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
