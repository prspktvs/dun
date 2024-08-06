import { getQuery } from '../database/index.js'
import { SELECT_CARD_BY_CHAT_ID } from '../database/queries.js'
import { searchDocuments } from '../utils/typesense.js'

export const getSendPushToChatFn = sendNotification => async (req, res) => {
  try {
    // @TODO: auth
    const msg = req.body
    console.log('MSG', msg)
    const dbCard = (await getQuery(SELECT_CARD_BY_CHAT_ID, ['%'+req.params.chatId+'%']))
    const cardId = dbCard.id
    const projectId = dbCard.project_id
    console.log('cardId', cardId, 'projectId', projectId)

    const results = await searchDocuments({q: '', query_by: 'title', filter_by: `id:=${cardId}`})
    const card = results.hits[0].document
    console.log('CARD', card)

    const notification = {
      title: card.title,
      body: (msg?.author ? (msg?.author + ': ') : '') + msg.text,
      data: { ...msg, cardId, projectId }
    }
    card.user_ids?.map(id => {
      sendNotification(id, notification)
    })

    res.json({ status: 'ok' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}