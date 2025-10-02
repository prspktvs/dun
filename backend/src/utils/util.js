import { TiptapTransformer } from '@hocuspocus/transformer'
import { allQuery, db, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_UNUSED_FILES_QUERY,
  DELETE_UNUSED_TASKS_QUERY,
  INSERT_FILES_QUERY,
  INSERT_MENTION_QUERY,
  INSERT_TASK_QUERY,
  SELECT_ALL_CARD_TASKS_QUERY,
  SELECT_CARD_BY_ID_QUERY,
  SELECT_MENTIONS_QUERY,
  UPDATE_CARD_QUERY,
} from '../database/queries.js'
import parser from './parser.js'
import { addDocument } from './typesense.js'
import { createNotification, NOTIFICATION_TYPES } from '../services/notification.service.js'

const notificationCooldowns = new Map()

const shouldSendTopicNotification = (cardId, userId) => {
  const key = `${cardId}-${userId}`
  const now = Date.now()
  const lastSent = notificationCooldowns.get(key)
  const cooldownPeriod = 30000

  if (!lastSent || now - lastSent > cooldownPeriod) {
    notificationCooldowns.set(key, now)

    if (notificationCooldowns.size > 1000) {
      const cutoff = now - cooldownPeriod * 2
      for (const [k, timestamp] of notificationCooldowns.entries()) {
        if (timestamp < cutoff) {
          notificationCooldowns.delete(k)
        }
      }
    }

    return true
  }
  return false
}

class UserNotifications {
  notifications = {}

  addToUserNotifications = async (
    action,
    data,
    user = {},
    projectId = '',
    topicTitle = '',
    cardUsers = [],
  ) => {
    const { id, users } = data
    console.log('addToUserNotifications called', {
      action,
      data,
      user,
      projectId,
      topicTitle,
      cardUsers,
    })
    const promises = users.map(async (userId) => {

      // @TODO: add privacy check: private (author + users or public)
      // if (!cardUsers.includes(userId)) {
      //   console.log('User not in card, skipping notification', userId, cardUsers)
      //   return
      // }

      if (!this.notifications[userId]) {
        this.notifications[userId] = { updatedTasks: [], deletedTasks: [], mentions: [] }
      }

      let notificationType
      let notificationData = {
        firstName: user.name?.split(' ')[0] || 'Someone',
        fullName: user.name || 'Someone',
        projectTitle: `Project ${projectId}`,
        topicTitle,
      }

      switch (action) {
        case 'update_task':
          this.notifications[userId].updatedTasks.push(data)
          notificationType = NOTIFICATION_TYPES.TASK_ASSIGNED
          break
        case 'delete_task':
          this.notifications[userId].deletedTasks.push(id)
          break
        case 'mention':
          this.notifications[userId].mentions.push(data)
          notificationType = NOTIFICATION_TYPES.TOPIC_MENTION
          break
        default:
          break
      }

      if (notificationType && userId !== user.user_id) {
        try {
          console.log('Creating notification', { userId, notificationType, projectId, data })
          await createNotification({
            userId,
            type: notificationType,
            projectId: projectId,
            cardId: data.cardId || data.card_id,
            taskId: action === 'update_task' ? data.id : null,
            authorId: user.user_id,
            authorName: user.name,
            data: notificationData,
          })
        } catch (error) {
          console.error('Error creating notification:', error)
        }
      }
    })

    await Promise.all(promises)
  }
}

const saveAllContent = ({
  cardId,
  allTasks,
  allFiles,
  allMentions,
  currentTasks,
  addToUserNotifications,
}) =>
  new Promise((resolve, _reject) => {
    db.serialize(() => {
      const mentions_stmt = db.prepare(INSERT_MENTION_QUERY)
      allMentions.forEach((mention) => {
        mentions_stmt.run(mention.id, mention.text, mention.user)
      })
      mentions_stmt.finalize()

      const tasks_stmt = db.prepare(INSERT_TASK_QUERY)
      allTasks.forEach((task) => {
        if (
          currentTasks.has(task.id) &&
          +currentTasks.get(task.id).isDone == task.isDone &&
          currentTasks.get(task.id).text == task.text &&
          currentTasks.get(task.id).priority == task.priority &&
          currentTasks.get(task.id).status == task.status &&
          currentTasks.get(task.id).author == task.author &&
          currentTasks.get(task.id).users == JSON.stringify(task.users)
        )
          return

        console.log(
          INSERT_TASK_QUERY,
          task.id,
          +task.isDone,
          task.text,
          task.priority,
          task.status,
          task.author,
          JSON.stringify(task.users),
          cardId,
          new Date().toISOString(),
        )
        tasks_stmt.run(
          task.id,
          +task.isDone,
          task.text,
          task.priority,
          task.status,
          task.author,
          JSON.stringify(task.users),
          cardId,
          new Date().toISOString(),
        )
        console.log('Updating task', { ...task, card_id: cardId })
        addToUserNotifications('update_task', { ...task, card_id: cardId })
      })
      tasks_stmt.finalize()

      db.run(`DELETE FROM files WHERE card_id = ? AND id LIKE ?`, [cardId, `${cardId}_%`])

      const files_stmt = db.prepare(INSERT_FILES_QUERY)
      allFiles.forEach((file) => {
        files_stmt.run(file.id, file.type, file.url, cardId)
        console.log(INSERT_FILES_QUERY, file.id, file.type, file.url, cardId)
      })

      files_stmt.finalize()

      resolve()
    })
  })

const deleteUnusedContent = async ({ deleteTaskIds, deleteFilesIds }) => {
  const tasksPlaceholders = deleteTaskIds.map(() => '?').join(',')
  await runQuery(DELETE_UNUSED_TASKS_QUERY(tasksPlaceholders), deleteTaskIds)
  const filesPlaceholders = deleteFilesIds.map(() => '?').join(',')
  await runQuery(DELETE_UNUSED_FILES_QUERY(filesPlaceholders), deleteFilesIds)
}

const onStoreDocument = async ({
  data,
  broadcast: { sendMessageToUser, sendMessageToProject },
}) => {
  const user = data.context?.user
  const json = TiptapTransformer.fromYdoc(data.document, 'document-store')

  const splitted = data.documentName.split('/')
  const projectId = splitted[0]
  const cardId = splitted[2]

  const {
    tasks: allTasks,
    files: allFiles,
    mentions: allMentions,
    description,
    text,
  } = parser(json, cardId)

  const { notifications, addToUserNotifications } = new UserNotifications()

  const taskIds = allTasks.map((task) => task.id)
  const mentionsIds = allMentions.map((mention) => mention.id)
  const mentionsPlaceholders = mentionsIds.map(() => '?').join(',')
  const [currentCard, currentMentions, allCardTasks] = await Promise.all([
    getQuery(SELECT_CARD_BY_ID_QUERY, cardId),
    allQuery(SELECT_MENTIONS_QUERY(mentionsPlaceholders), mentionsIds),
    allQuery(SELECT_ALL_CARD_TASKS_QUERY, cardId),
  ])
  const currentTasks = new Map(allCardTasks.map((task) => [task.id, task]))

  const deleteTasks = [...currentTasks.values()].filter((t) => !taskIds.includes(t.id))
  const deleteTaskIds = deleteTasks.map((t) => t.id)

  const deleteFilesIds = []

  const newMentions = allMentions.filter(
    (mention) => !currentMentions.map((m) => m.id).includes(mention.id),
  )

  const topicTitle = currentCard?.title || 'Untitled Topic'
  const cardUsers = JSON.parse(currentCard?.users || '[]')

  await Promise.all([
    saveAllContent({
      cardId,
      allTasks,
      allFiles,
      allMentions,
      currentTasks,
      addToUserNotifications: (action, data) =>
        addToUserNotifications(action, data, user, projectId, topicTitle, cardUsers),
    }),
    runQuery(UPDATE_CARD_QUERY, [JSON.stringify(description), new Date().toISOString(), cardId]),
    deleteUnusedContent({ deleteTaskIds, deleteFilesIds }),
  ])

  if (deleteTasks.length > 0) {
    for (const task of deleteTasks) {
      await addToUserNotifications(
        'delete_task',
        {
          ...task,
          isDone: Boolean(task.isDone),
          users: JSON.parse(task.users),
          card_id: cardId,
        },
        user,
        projectId,
        topicTitle,
        cardUsers,
      )
    }
  }

  for (const mention of newMentions) {
    await addToUserNotifications(
      'mention',
      { cardId, projectId, ...mention, users: [mention.user] },
      user,
      projectId,
      topicTitle,
      cardUsers,
    )
  }
  addDocument({
    id: cardId,
    title: currentCard?.title,
    project_id: projectId,
    content: text,
    updated_at: Date.now(),
    created_at: Date.now(),
    author_id: user.user_id,
    author: user.name,
    public: false,
    user_ids: JSON.parse(currentCard.users || '[]'),
  }).catch(console.error)

  const currentAllFiles = JSON.parse(currentCard?.files || '[]')
  const currentDocumentFiles = currentAllFiles.filter((file) => file.id.startsWith(`${cardId}_`))

  const isCardUpdated =
    currentCard.description !== JSON.stringify(description) ||
    JSON.stringify(currentDocumentFiles) !== JSON.stringify(allFiles) ||
    currentCard.tasks !== JSON.stringify(allTasks)

  if (isCardUpdated) {
    const updatedCard = await getQuery(SELECT_CARD_BY_ID_QUERY, cardId)
    const updatedFiles = JSON.parse(updatedCard?.files || '[]')

    sendMessageToProject(projectId, {
      id: cardId,
      description,
      files: updatedFiles,
      tasks: allTasks,
      type: 'card',
    })

    for (const userId of cardUsers) {
      if (userId !== user?.user_id && shouldSendTopicNotification(cardId, userId)) {
        await createNotification({
          userId,
          type: NOTIFICATION_TYPES.TOPIC_CHANGED,
          projectId,
          cardId,
          authorId: user?.user_id,
          authorName: user?.name,
          data: {
            firstName: user?.name?.split(' ')[0] || 'Someone',
            projectTitle: `Project ${projectId}`,
            topicTitle: currentCard?.title || 'Untitled Topic',
          },
        })
      }
    }
  }

  Object.keys(notifications).forEach((userId) => {
    sendMessageToUser(userId, { ...notifications[userId], type: 'tasks', cardId, projectId })
  })
}

export { onStoreDocument }
