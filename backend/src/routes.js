import express from 'express'
import { getUserTasks } from './api/tasks.js'
import { createCard, deleteCard, getAllProjectCards, getCardById, updateCard } from './api/cards.js'

const router = express.Router()

// tasks
router.get('/tasks', getUserTasks)

// cards
router.get('/cards', getAllProjectCards)
router.get('/cards/:id', getCardById)
router.post('/cards', createCard)
router.patch('/cards/:id', updateCard)
router.delete('/cards/:id', deleteCard)

export default router
