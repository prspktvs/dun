import { Router } from 'express'
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notification.service.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0

    const notifications = await getUserNotifications(userId, limit, offset)
    res.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const count = await getUnreadNotificationsCount(userId)
    res.json({ count })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id/read', async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.params
    await markNotificationAsRead(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/mark-all-read', async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    await markAllNotificationsAsRead(userId)
    res.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.params
    await deleteNotification(id)
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
