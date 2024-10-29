import express from 'express';
import { getUserTasks, createTask, getTasksWithCards } from './api/tasks.js';
import {
  searchCards,
  createCard,
  getAllProjectCards,
  getCardById,
  deleteCard,
  updateCard,
  shareCard,
  unshareCard,
  getAllCardsWithTasks,
} from './api/cards.js';

const router = express.Router();

// tasks
router.get('/tasks', (req, res) => {
  const { includeCards } = req.query;

  if (includeCards === 'true') {
    return getTasksWithCards(req, res);
  }

  return getUserTasks(req, res);
});

router.post('/tasks', createTask);

// cards
router.get('/cards', getAllProjectCards);
router.get('/cards/search', searchCards);
router.get('/cards/:id', getCardById);
router.post('/cards', createCard);
router.patch('/cards/:id', updateCard);
router.delete('/cards/:id', deleteCard);
router.post('/cards/:id/share', shareCard);
router.delete('/cards/:id/share/:userId', unshareCard);
router.get('/project/:projectId/tasks', getAllCardsWithTasks);

export default router;
