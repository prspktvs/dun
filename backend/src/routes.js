import express from 'express'
import {
  searchCards,
  createCard,
  getAllProjectCards,
  getCardById,
  deleteCard,
  updateCard,
  shareCard,
  unshareCard,
  deleteCardChat,
} from './api/cards.js'
import { getUserTasks, updateTask, updateTasksOrderBatch } from './api/tasks.js'

const router = express.Router()

// tasks
router.get('/tasks', getUserTasks)
router.post('/tasks/:id', updateTask)
router.patch('/tasks/order-batch', updateTasksOrderBatch)

// cards
router.get('/cards', getAllProjectCards)
router.get('/cards/search', searchCards)
router.get('/cards/:id', getCardById)
router.post('/cards', createCard)
router.patch('/cards/:id', updateCard)
router.delete('/cards/:id', deleteCard)
router.post('/cards/:id/share', shareCard)
router.delete('/cards/:id/share/:userId', unshareCard)
router.delete('/cards/:id/chats/:chatId', deleteCardChat)
export default router
