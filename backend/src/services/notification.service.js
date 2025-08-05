import { allQuery, getQuery, runQuery } from '../database/index.js'
import {
  INSERT_NOTIFICATION_QUERY,
  SELECT_USER_NOTIFICATIONS_QUERY,
  SELECT_UNREAD_NOTIFICATIONS_COUNT_QUERY,
  MARK_NOTIFICATION_READ_QUERY,
  MARK_ALL_NOTIFICATIONS_READ_QUERY,
  DELETE_NOTIFICATION_QUERY,
} from '../database/queries.js'

export const NOTIFICATION_TYPES = {
  TOPIC_SHARED: 'topic_shared',
  TOPIC_CHANGED: 'topic_changed',
  TASK_ASSIGNED: 'task_assigned',
  FILE_ATTACHED: 'file_attached',
  DISCUSSION_STARTED: 'discussion_started',
  DISCUSSION_MESSAGE: 'discussion_message',
  DISCUSSION_MENTION: 'discussion_mention',
  TOPIC_MENTION: 'topic_mention',
  PROJECT_JOINED: 'project_joined',
  PROJECT_LEFT: 'project_left',
}

const NOTIFICATION_TEMPLATES = {
  [NOTIFICATION_TYPES.TOPIC_SHARED]: {
    title: 'Topic Shared',
    message: '{firstName} shared topic with you {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.TOPIC_CHANGED]: {
    title: 'Topic Updated',
    message: '{firstName} made changes {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.TASK_ASSIGNED]: {
    title: 'Task Assigned',
    message: '{firstName} assigned you a new task {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.FILE_ATTACHED]: {
    title: 'File Attached',
    message: '{firstName} attached a file/an image {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.DISCUSSION_STARTED]: {
    title: 'Discussion Started',
    message: '{firstName} started a discussion {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.DISCUSSION_MESSAGE]: {
    title: 'New Message',
    message: '{firstName} left a message in discussion {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.DISCUSSION_MENTION]: {
    title: 'Mentioned in Discussion',
    message: '{firstName} mentioned you in discussion {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.TOPIC_MENTION]: {
    title: 'Mentioned in Topic',
    message: '{firstName} mentioned you in topic {projectTitle}: {topicTitle}',
  },
  [NOTIFICATION_TYPES.PROJECT_JOINED]: {
    title: 'Project Member Joined',
    message: '{fullName} joined the project {projectTitle}',
  },
  [NOTIFICATION_TYPES.PROJECT_LEFT]: {
    title: 'Project Member Left',
    message: '{fullName} left the project {projectTitle}',
  },
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function formatMessage(template, data) {
  return template.replace(/\{([^}]+)\}/g, (match, key) => data[key] || match)
}

export async function createNotification({
  userId,
  type,
  projectId,
  cardId = null,
  chatId = null,
  taskId = null,
  fileId = null,
  authorId,
  authorName,
  data = {},
}) {
  const template = NOTIFICATION_TEMPLATES[type]
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`)
  }

  const id = generateId()
  const title = formatMessage(template.title, data)
  const message = formatMessage(template.message, data)
  const createdAt = new Date().toISOString()

  await runQuery(INSERT_NOTIFICATION_QUERY, [
    id,
    userId,
    type,
    title,
    message,
    projectId,
    cardId,
    chatId,
    taskId,
    fileId,
    authorId,
    authorName,
    createdAt,
  ])

  return {
    id,
    user_id: userId,
    type,
    title,
    message,
    project_id: projectId,
    card_id: cardId,
    chat_id: chatId,
    task_id: taskId,
    file_id: fileId,
    author_id: authorId,
    author_name: authorName,
    is_read: 0,
    created_at: createdAt,
  }
}

export async function getUserNotifications(userId, limit = 20, offset = 0) {
  return await allQuery(SELECT_USER_NOTIFICATIONS_QUERY, [userId, limit, offset])
}

export async function getUnreadNotificationsCount(userId) {
  const result = await getQuery(SELECT_UNREAD_NOTIFICATIONS_COUNT_QUERY, [userId])
  return result?.count || 0
}

export async function markNotificationAsRead(notificationId) {
  await runQuery(MARK_NOTIFICATION_READ_QUERY, [notificationId])
}

export async function markAllNotificationsAsRead(userId) {
  await runQuery(MARK_ALL_NOTIFICATIONS_READ_QUERY, [userId])
}

export async function deleteNotification(notificationId) {
  await runQuery(DELETE_NOTIFICATION_QUERY, [notificationId])
}
