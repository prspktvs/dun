import { allQuery, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_CARD_QUERY,
  INSERT_NEW_CARD_QUERY,
  SELECT_ALL_CARDS_BY_PROJECTID_QUERY,
  SELECT_CARD_BY_ID_QUERY,
  INSERT_NEW_USERS_TO_CARD_QUERY,
  SELECT_ALL_CARDS_WITH_TASKS_AND_FILES_QUERY,
} from '../database/queries.js'
import { searchDocuments } from '../utils/typesense.js'

function deserializeCard(card) {
  return {
    ...card,
    description: JSON.parse(card?.description || '[]'),
    chatIds: JSON.parse(card?.chatIds || '[]'),
    files: JSON.parse(card?.files || '[]'),
    users: JSON.parse(card?.users || '[]'),
  }
}

export const searchCards = async (req, res) => {
  try {
    const { q, project_id } = req.query
    const results = await searchDocuments({
      q,
      query_by: 'title,content,author',
      filter_by: `project_id:=${project_id} && (author_id:=${req.user.user_id} || user_ids:=${req.user.user_id})`,
    })
    const cardIds = results.hits.map((hit) => `'${hit.document.id}'`).join(',')
    const cards = cardIds?.length
      ? await allQuery(SELECT_ALL_CARDS_BY_PROJECTID_QUERY.replace('$IDS', cardIds), [project_id])
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
    const userId = req.user.user_id
    const sortBy = req.query.sort || 'createdAt'
    const cards = await allQuery(SELECT_ALL_CARDS_WITH_TASKS_AND_FILES_QUERY, [id, userId, userId])
    res.status(200).json(cards.map(deserializeCard))
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    res.status(200).json(deserializeCard(card))
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const createCard = async (req, res) => {
  try {
    const { id, title, description, createdAt, chatIds, projectId, author, users } = req.body
    await runQuery(INSERT_NEW_CARD_QUERY, [
      id,
      title,
      JSON.stringify(description || []),
      createdAt,
      JSON.stringify(chatIds || []),
      JSON.stringify(users || []),
      author,
      projectId,
    ])
    res.status(201).send({ id, title, description, createdAt, chatIds, projectId, author, users })
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
    delete updateFields.author
    delete updateFields.createdAt
    delete updateFields.files
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    const chatIds = JSON.parse(card.chatIds || '[]')
    if (updateFields?.chatIds?.length > 0) {
      updateFields.chatIds.forEach((chatId) => {
        if (!chatIds.includes(chatId)) {
          chatIds.push(chatId)
        }
      })
    }
    const newFields = {
      ...updateFields,
      description: JSON.stringify(updateFields.description || []),
      chatIds: JSON.stringify(chatIds),
      users: JSON.stringify(updateFields?.users || []),
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

export const shareCard = async (req, res) => {
  try {
    const { id } = req.params
    const { userIds } = req.body
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card || !userIds) return res.status(404)
    const currentUserIds = JSON.parse(card.users || '[]')
    const updatedUsers = Array.from(new Set([...currentUserIds, ...userIds]))
    await runQuery(INSERT_NEW_USERS_TO_CARD_QUERY, [JSON.stringify(updatedUsers), id])
    res.status(200).send({ message: 'Card is shared' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const unshareCard = async (req, res) => {
  try {
    const { id, userId } = req.params
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card) return res.status(404)
    const currentUserIds = JSON.parse(card.users || '[]')
    const updatedUsers = currentUserIds.filter((u) => u !== userId)
    await runQuery(INSERT_NEW_USERS_TO_CARD_QUERY, [JSON.stringify(updatedUsers), id])
    res.status(200).send({ message: 'Card is unshared' })
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
}

export const getAllCardsWithTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId
    const data = await allQuery(SELECT_ALL_CARDS_WITH_TASKS_AND_FILES_QUERY, [projectId])
    const cardsWithTasks = data.map((card) => ({
      ...deserializeCard(card),
      tasks: JSON.parse(card.tasks || '[]'),
    }))
    res.status(200).json(cardsWithTasks)
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal server error')
  }
}
