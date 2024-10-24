// routes.js
import { Router } from 'express';
import { getUserTasks, createTask, getTasksWithCards } from './api/tasks.js';
import {
  searchCards,
  createCard,
  deleteCard,
  getAllProjectCards,
  getCardById,
  updateCard,
  shareCard,
  unshareCard,
  getAllCardsWithTasks,
} from './api/cards.js';

const router = Router();

// tasks
router.get('/tasks', getUserTasks);
router.post('/tasks', createTask);
router.get('/tasks-with-cards', getTasksWithCards);  // Новый маршрут для получения задач с карточками

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