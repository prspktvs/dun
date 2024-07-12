import { TiptapTransformer } from '@hocuspocus/transformer'
import { allQuery, db, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_UNUSED_FILES_QUERY,
  DELETE_UNUSED_TASKS_QUERY,
  INSERT_FILES_QUERY,
  INSERT_TASK_QUERY,
  SELECT_ALL_CARD_TASKS_QUERY,
  SELECT_CARD_WITH_FILES_QUERY,
  UPDATE_CARD_DESCRIPTION_QUERY,
} from '../database/queries.js'
import parser from './parser.js'
import { io } from '../server.js'

class UserNotifications {
  notifications = {}

  addToUserNotifications = (task, action) => {
    const { id: taskId, users } = task
    users.forEach((userId) => {
      if (!this.notifications[userId]) {
        this.notifications[userId] = { updatedTasks: [], deletedTasks: [] }
      }
      if (action === 'updated') {
        this.notifications[userId].updatedTasks.push(task)
      } else if (action === 'deleted') {
        this.notifications[userId].deletedTasks.push(taskId)
      }
    })
  }
}

const saveAllTasksAndFiles = ({ cardId, allTasks, allFiles, currentTasks, userNotifications }) =>
  new Promise((resolve, reject) => {
    db.serialize(() => {
      const tasks_stmt = db.prepare(INSERT_TASK_QUERY)
      allTasks.forEach((task) => {
        if (
          currentTasks.has(task.id) &&
          +currentTasks.get(task.id).isDone == task.isDone &&
          currentTasks.get(task.id).text == task.text &&
          currentTasks.get(task.id).users == JSON.stringify(task.users)
        )
          return

        tasks_stmt.run(task.id, +task.isDone, task.text, JSON.stringify(task.users), cardId)

        userNotifications.addToUserNotifications(task, 'updated')
      })
      tasks_stmt.finalize()

      const files_stmt = db.prepare(INSERT_FILES_QUERY)
      allFiles.forEach((file) => {
        files_stmt.run(file.id, file.type, file.url, cardId)
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

const onStoreDocument = async (data) => {
  const json = TiptapTransformer.fromYdoc(data.document, 'document-store')

  const splitted = data.documentName.split('/')
  const projectId = splitted[0]
  const cardId = splitted[2]

  const { allTasks, allFiles, description } = parser(json)

  const userNotifications = new UserNotifications()
  const { notifications } = userNotifications

  const taskIds = allTasks.map((task) => task.id)

  const currentCard = await getQuery(SELECT_CARD_WITH_FILES_QUERY, cardId)
  const res = await allQuery(SELECT_ALL_CARD_TASKS_QUERY, cardId)
  const currentTasks = new Map(res.map((task) => [task.id, task]))
  const deleteTasks = [...currentTasks.values()].filter((t) => !taskIds.includes(t.id))
  const deleteTaskIds = deleteTasks.map((t) => t.id)
  const deleteFiles = JSON.parse(currentCard.files).filter(
    (file) => !allFiles.map((f) => f.id).includes(file.id),
  )
  const deleteFilesIds = deleteFiles.map((f) => f.id)

  const isCardUpdated =
    currentCard.description !== JSON.stringify(description) ||
    currentCard.files !== JSON.stringify(allFiles)

  await runQuery('BEGIN TRANSACTION')
  await saveAllTasksAndFiles({ cardId, allTasks, allFiles, currentTasks, userNotifications })
  await runQuery(UPDATE_CARD_DESCRIPTION_QUERY, [JSON.stringify(description), cardId])

  await deleteUnusedContent({ deleteTaskIds, deleteFilesIds })
  await runQuery('COMMIT')

  deleteTasks?.forEach((task) => {
    userNotifications.addToUserNotifications(
      { ...task, isDone: Boolean(task.isDone), users: JSON.parse(task.users) },
      'deleted',
    )
  })

  // Send updates
  if (isCardUpdated)
    io.to(projectId).emit('update_cards', { id: cardId, description, files: allFiles })

  Object.keys(notifications).forEach((userId) => {
    io.to(userId).emit('update_tasks', notifications[userId])
  })
}

export { onStoreDocument }
