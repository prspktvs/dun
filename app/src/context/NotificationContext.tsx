import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'

import { useAuth } from './AuthContext'
import { apiRequest } from '../utils/api'

export interface INotification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  projectId?: string
  cardId?: string
  chatId?: string
  taskId?: string
  fileId?: string
  authorId?: string
  authorName?: string
  isRead: boolean
  createdAt: string
}

interface DatabaseNotification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  project_id?: string
  card_id?: string
  chat_id?: string
  task_id?: string
  file_id?: string
  author_id?: string
  author_name?: string
  is_read: number
  created_at: string
}

interface NotificationContextType {
  notifications: INotification[]
  unreadCount: number
  loading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  fetchNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      const data = await apiRequest<DatabaseNotification[]>('notifications')

      const mappedNotifications: INotification[] = data.map((notification) => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        projectId: notification.project_id,
        cardId: notification.card_id,
        chatId: notification.chat_id,
        taskId: notification.task_id,
        fileId: notification.file_id,
        authorId: notification.author_id,
        authorName: notification.author_name,
        isRead: Boolean(notification.is_read),
        createdAt: notification.created_at,
      }))
      setNotifications(mappedNotifications)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const data = await apiRequest<{ count: number }>('notifications/unread-count')
      setUnreadCount(data.count)
    } catch {}
  }, [isAuthenticated])

  const markAsRead = async (notificationId: string) => {
    try {
      await apiRequest(`notifications/${notificationId}/read`, { method: 'PUT' })
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {}
  }

  const markAllAsRead = async () => {
    try {
      await apiRequest('notifications/mark-all-read', { method: 'PUT' })
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await apiRequest(`notifications/${notificationId}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
      const notification = notifications.find((n) => n.id === notificationId)
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch {}
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const connectWebSocket = () => {
      const wsUrl = `${process.env.VITE_BACKEND_WS_URL || 'wss://api.dun.wtf'}/updates?token=${localStorage.getItem('token')}`
      const ws = new WebSocket(wsUrl)

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          if (message.type === 'notification_update') {
            fetchUnreadCount()
          }
        } catch {}
      }

      ws.onclose = () => {
        setTimeout(connectWebSocket, 3000)
      }

      return ws
    }

    const ws = connectWebSocket()

    return () => {
      ws.close()
    }
  }, [isAuthenticated, user, fetchUnreadCount])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
        fetchUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
