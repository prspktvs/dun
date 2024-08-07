import { allQuery, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_CARD_QUERY,
  INSERT_NEW_CARD_QUERY,
  SELECT_ALL_CARDS_BY_PROJECTID_QUERY,
  SELECT_CARD_BY_ID_QUERY,
  SELECT_ALL_CARDS_BY_IDS
} from '../database/queries.js'
import { searchDocuments } from '../utils/typesense.js'

function deserializeCard(card) {
  return {
    ...card,
    description: JSON.parse(card.description),
    chatIds: JSON.parse(card.chatIds),
    files: JSON.parse(card?.files || '[]'),
  }
}

export const searchCards = async (req, res) => {
  try {
    const { q, project_id } = req.query
    const results = await searchDocuments({
      q,
      query_by: "title,content,author",
      filter_by: `project_id:=${project_id} && (public:=true || author:=${req.user.id} || user_ids:=${req.user.id})`,
    })
    console.log(results)
    const cardIds = results.hits.map((hit) => `'${hit.document.id}'`).join(',')
    const cards = cardIds?.length ?
      await allQuery(SELECT_ALL_CARDS_BY_IDS.replace('$IDS', cardIds), [project_id]) // :derp; https://github.com/TryGhost/node-sqlite3/issues/762
      : []
    res.json(cards.map(deserializeCard))
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const getAllProjectCards = async (req, res) => {
  try {
    const id = req.query.projectId
    const sortBy = req.query.sort || 'createdAt'
    const cards = await allQuery(SELECT_ALL_CARDS_BY_PROJECTID_QUERY(sortBy), [id])

    res.status(200).json(
      cards.map(deserializeCard),
    )
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params

    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])

    res.status(200).json({
      ...card,
      description: JSON.parse(card?.description || '[]'),
      chatIds: JSON.parse(card?.chatIds || '[]'),
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const createCard = async (req, res) => {
  try {
    const { id, title, description, createdAt, chatIds, projectId } = req.body

    await runQuery(INSERT_NEW_CARD_QUERY, [
      id,
      title,
      JSON.stringify(description || []),
      JSON.stringify(createdAt),
      JSON.stringify(chatIds || []),
      projectId,
    ])
    res.status(201).send({ id, title, description, createdAt, chatIds, projectId })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params
    const updateFields = req.body

    delete updateFields.projectId
    delete updateFields.files

    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])

    // add new chatIds to existing chatIds
    const chatIds = JSON.parse(card.chatIds)
    if (updateFields?.chatIds?.length > 0) {
      updateFields.chatIds.forEach((chatId) => {
        if (!chatIds.includes(chatId)) {
          chatIds.push(chatId)
        }
      })
    }

    const newFields = {
      ...updateFields,
      description: JSON.stringify(updateFields.description),
      chatIds: JSON.stringify(chatIds),
      project_id: card.project_id,
    }
    const columnsToUpdate = Object.keys(newFields).join('=?, ') + '=?'
    const valuesToUpdate = Object.values(newFields)
    valuesToUpdate.push(id)

    const query = `UPDATE cards SET ${columnsToUpdate} WHERE id=?`
    await runQuery(query, valuesToUpdate)

    const updatedCard = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])

    res.status(200).send(updatedCard)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params

    await runQuery(DELETE_CARD_QUERY, [id])

    res.status(204).send({ message: 'Card is deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}
