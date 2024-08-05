import { searchDocuments } from '../utils/typesense.js'

export const getSendPushToChatFn = sendNotification => async (req, res) => {
  try {
    // @TODO: auth
    const msg = req.body
    console.log('MSG', msg)
    const results = await searchDocuments({q: '', query_by: 'title', filter_by: `id:=${req.params.cardId}`})
    const card = results.hits[0].document
    console.log('CARD', card)
    const notification = {
      title: card.title,
      body: (msg?.author ? (msg?.author + ': ') : '') + msg.text,
      data: msg
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