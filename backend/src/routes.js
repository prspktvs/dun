import express from 'express'
import { getUserTasks } from './api/tasks.js'
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
} from './api/cards.js'

const router = express.Router()

// cards
router.get('/cards', getAllProjectCards)
router.get('/cards/search', searchCards)
router.get('/cards/:id', getCardById)
router.post('/cards', createCard)
router.patch('/cards/:id', updateCard)
router.delete('/cards/:id', deleteCard)
router.post('/cards/:id/share', shareCard)
router.delete('/cards/:id/share/:userId', unshareCard)

export default router
