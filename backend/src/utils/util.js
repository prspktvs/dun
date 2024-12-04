import { TiptapTransformer } from '@hocuspocus/transformer'
import { allQuery, db, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_UNUSED_FILES_QUERY,
  DELETE_UNUSED_TASKS_QUERY,
  INSERT_FILES_QUERY,
  INSERT_MENTION_QUERY,
  INSERT_TASK_QUERY,
  SELECT_ALL_CARD_TASKS_QUERY,
  SELECT_CARD_WITH_FILES_QUERY,
  SELECT_MENTIONS_QUERY,
  UPDATE_CARD_QUERY,
} from '../database/queries.js'
import parser from './parser.js'
import { addDocument } from './typesense.js'

class UserNotifications {
  notifications = {}

  addToUserNotifications = (action, data) => {
    const { id, users } = data
    users.forEach((userId) => {
      if (!this.notifications[userId]) {
        this.notifications[userId] = { updatedTasks: [], deletedTasks: [], mentions: [] }
      }
      switch (action) {
        case 'update_task':
          this.notifications[userId].updatedTasks.push(data)
          break
        case 'delete_task':
          this.notifications[userId].deletedTasks.push(id)
          break
        case 'mention':
          this.notifications[userId].mentions.push(data)
          break
        default:
          break
      }
    })
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
  new Promise((resolve, reject) => {
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
        )

        addToUserNotifications('update_task', { ...task, card_id: cardId })
      })
      tasks_stmt.finalize()

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
  } = parser(json)
  console.log('files', allFiles)

  // without await to not block the response
  // @TODO: optimize card title

  const { notifications, addToUserNotifications } = new UserNotifications()

  const taskIds = allTasks.map((task) => task.id)
  const mentionsIds = allMentions.map((mention) => mention.id)
  const mentionsPlaceholders = mentionsIds.map(() => '?').join(',')
  const [currentCard, currentMentions, allCardTasks] = await Promise.all([
    getQuery(SELECT_CARD_WITH_FILES_QUERY, cardId),
    allQuery(SELECT_MENTIONS_QUERY(mentionsPlaceholders), mentionsIds),
    allQuery(SELECT_ALL_CARD_TASKS_QUERY, cardId),
  ])
  const currentTasks = new Map(allCardTasks.map((task) => [task.id, task]))

  const deleteTasks = [...currentTasks.values()].filter((t) => !taskIds.includes(t.id))
  const deleteTaskIds = deleteTasks.map((t) => t.id)
  const deleteFiles = JSON.parse(currentCard?.files || '[]').filter(
    (file) => !allFiles.map((f) => f.id).includes(file.id),
  )
  const deleteFilesIds = deleteFiles.map((f) => f.id)

  const newMentions = allMentions.filter(
    (mention) => !currentMentions.map((m) => m.id).includes(mention.id),
  )

  await Promise.all([
    saveAllContent({
      cardId,
      allTasks,
      allFiles,
      allMentions,
      currentTasks,
      addToUserNotifications,
    }),
    runQuery(UPDATE_CARD_QUERY, [JSON.stringify(description), new Date().toISOString(), cardId]),
    deleteUnusedContent({ deleteTaskIds, deleteFilesIds }),
  ])

  if (deleteTasks.length > 0) {
    deleteTasks.forEach((task) => {
      addToUserNotifications('delete_task', {
        ...task,
        isDone: Boolean(task.isDone),
        users: JSON.parse(task.users),
        card_id: cardId,
      })
    })
  }
  console.log(currentCard)
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
  })
    .then((res) => console.log('Document added to typesense', res))
    .catch(console.error)

  // Send updates
  newMentions.forEach((mention) => {
    addToUserNotifications('mention', { cardId, projectId, ...mention, users: [mention.user] })
  })

  const isCardUpdated =
    currentCard.description !== JSON.stringify(description) ||
    currentCard.files !== JSON.stringify(allFiles)
  if (isCardUpdated)
    sendMessageToProject(projectId, { id: cardId, description, files: allFiles, type: 'card' })

  Object.keys(notifications).forEach((userId) => {
    sendMessageToUser(userId, { ...notifications[userId], type: 'tasks', cardId })
  })
}

export { onStoreDocument }
