import { allQuery, getQuery, runQuery } from '../database/index.js'
import {
  DELETE_CARD_QUERY,
  INSERT_NEW_CARD_QUERY,
  SELECT_ALL_CARDS_BY_PROJECTID_QUERY,
  SELECT_CARD_BY_ID_QUERY,
  INSERT_NEW_USERS_TO_CARD_QUERY,
  SELECT_ALL_CARDS_BY_IDS_QUERY,
  UPDATE_CARD_CHAT_IDS_QUERY,
} from '../database/queries.js'
import { searchDocuments } from '../utils/typesense.js'

function deserializeCard(card) {
  return {
    ...card,
    description: JSON.parse(card?.description || '[]'),
    chatIds: JSON.parse(card?.chatIds || '[]'),
    files: JSON.parse(card?.files || '[]'),
    tasks: JSON.parse(card?.tasks || '[]'),
    users: JSON.parse(card?.users || '[]'),
    public: !!card?.public,
  }
}

const parseJSONFields = (card) => ({
  chatIds: JSON.parse(card.chatIds || '[]'),
  users: JSON.parse(card.users || '[]'),
  description: JSON.parse(card.description || '[]'),
})

const updateFieldArrays = (existingArray, newArray) => {
  newArray.forEach((item) => {
    if (!existingArray.includes(item)) {
      existingArray.push(item)
    }
  })
  return existingArray
}

const handleError = (res, error, message = 'Internal server error') => {
  console.error(message, error)
  res.status(500).send(message)
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
      ? await allQuery(SELECT_ALL_CARDS_BY_IDS_QUERY.replace('$IDS', cardIds), [project_id])
      : []
    res.json(cards.map(deserializeCard))
  } catch (error) {
    handleError(res, error)
  }
}

export const getAllProjectCards = async (req, res) => {
  try {
    const { projectId: id, sort = 'createdAt' } = req.query
    const userId = req.user.user_id
    const cards = await allQuery(SELECT_ALL_CARDS_BY_PROJECTID_QUERY(sort), [id, userId, userId])
    res.status(200).json(cards.map(deserializeCard))
  } catch (error) {
    handleError(res, error)
  }
}

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card) {
      return res.status(404).send('Card not found')
    }
    res.status(200).json(deserializeCard(card))
  } catch (error) {
    handleError(res, error)
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
    handleError(res, error)
  }
}

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params
    const updateFields = req.body

    const fieldsToRemove = ['projectId', 'author', 'createdAt', 'files', 'tasks']
    fieldsToRemove.forEach((field) => delete updateFields[field])

    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card) {
      return res.status(404).send('Card not found')
    }

    const { chatIds, users, description } = parseJSONFields(card)

    if (updateFields.chatIds?.length > 0) {
      updateFields.chatIds = updateFieldArrays(chatIds, updateFields.chatIds)
    }

    const newFields = {
      ...updateFields,
      description: JSON.stringify(updateFields.description || description),
      chatIds: JSON.stringify(updateFields.chatIds || chatIds),
      users: JSON.stringify(updateFields.users || users),
      public: +(updateFields.public ?? card.public),
    }

    const columnsToUpdate = Object.keys(newFields)
      .map((key) => `${key}=?`)
      .join(', ')
    const valuesToUpdate = [...Object.values(newFields), id]
    const query = `UPDATE cards SET ${columnsToUpdate} WHERE id=?`

    await runQuery(query, valuesToUpdate)
    const updatedCard = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    res.status(200).json(deserializeCard(updatedCard))
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params
    await runQuery(DELETE_CARD_QUERY, [id])
    res.status(204).send({ message: 'Card is deleted' })
  } catch (error) {
    handleError(res, error)
  }
}

export const shareCard = async (req, res) => {
  try {
    const { id } = req.params
    const { userIds } = req.body
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card || !userIds) return res.status(404).send('Card or user IDs not found')
    const currentUserIds = JSON.parse(card.users || '[]')
    const updatedUsers = Array.from(new Set([...currentUserIds, ...userIds]))
    await runQuery(INSERT_NEW_USERS_TO_CARD_QUERY, [JSON.stringify(updatedUsers), id])
    res.status(200).send({ message: 'Card is shared' })
  } catch (error) {
    handleError(res, error)
  }
}

export const unshareCard = async (req, res) => {
  try {
    const { id, userId } = req.params
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card) return res.status(404).send('Card not found')
    const currentUserIds = JSON.parse(card.users || '[]')
    const updatedUsers = currentUserIds.filter((u) => u !== userId)
    await runQuery(INSERT_NEW_USERS_TO_CARD_QUERY, [JSON.stringify(updatedUsers), id])
    res.status(200).send({ message: 'Card is unshared' })
  } catch (error) {
    handleError(res, error)
  }
}

export const deleteCardChat = async (req, res) => {
  try {
    const { id, chatId } = req.params
    const card = await getQuery(SELECT_CARD_BY_ID_QUERY, [id])
    if (!card) return res.status(404).json({ message: 'Card not found' })

    const chatIds = JSON.parse(card.chatIds)
    const updatedChats = chatIds.filter((chat) => chat !== chatId)
    await runQuery(UPDATE_CARD_CHAT_IDS_QUERY, [JSON.stringify(updatedChats), id])

    res.status(200).send({ message: 'Chat is deleted' })
  } catch (error) {
    handleError(res, error)
  }
}
