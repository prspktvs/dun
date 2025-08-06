import { getQuery } from '../database/index.js'
import { SELECT_CARD_BY_CHAT_ID } from '../database/queries.js'
import { searchDocuments } from '../utils/typesense.js'
import { createNotification, NOTIFICATION_TYPES } from '../services/notification.service.js'

export const getSendPushToChatFn = (sendNotification, sendMessageToUser) => async (req, res) => {
  try {
    const msg = req.body
    const dbCard = await getQuery(SELECT_CARD_BY_CHAT_ID, ['%' + req.params.chatId + '%'])
    const cardId = dbCard.id
    const projectId = dbCard.project_id

    const results = await searchDocuments({ q: '', query_by: 'title', filter_by: `id:=${cardId}` })
    const card = results.hits[0].document

    const notification = {
      title: card.title,
      body: (msg?.author ? msg?.author + ': ' : '') + msg.text,
      data: { ...msg, cardId, projectId },
    }

    const authorName = msg?.author || 'Someone'
    const cardUsers = JSON.parse(dbCard.users || '[]')

    for (const userId of cardUsers) {
      sendNotification(userId, notification)

      if (userId !== msg.authorId) {
        const notificationType = msg.isFirstMessage
          ? NOTIFICATION_TYPES.DISCUSSION_STARTED
          : NOTIFICATION_TYPES.DISCUSSION_MESSAGE

        await createNotification({
          userId,
          type: notificationType,
          projectId,
          cardId,
          chatId: req.params.chatId,
          authorId: msg.authorId,
          authorName,
          data: {
            firstName: authorName.split(' ')[0] || 'Someone',
            projectTitle: `in project`,
            topicTitle: card.title || 'Untitled Topic',
          },
        })

        sendMessageToUser(userId, { type: 'notification_update' })
      }
    }

    if (msg.mentions && Array.isArray(msg.mentions)) {
      for (const mentionUserId of msg.mentions) {
        if (mentionUserId !== msg.authorId && cardUsers.includes(mentionUserId)) {
          await createNotification({
            userId: mentionUserId,
            type: NOTIFICATION_TYPES.DISCUSSION_MENTION,
            projectId,
            cardId,
            chatId: req.params.chatId,
            authorId: msg.authorId,
            authorName,
            data: {
              firstName: authorName.split(' ')[0] || 'Someone',
              projectTitle: `in project`,
              topicTitle: card.title || 'Untitled Topic',
            },
          })

          sendMessageToUser(mentionUserId, { type: 'notification_update' })
        }
      }
    }

    res.json({ status: 'ok' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}
