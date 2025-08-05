import { runQuery, allQuery, getQuery } from '../database/index.js'
import {
  SELECT_FILES_BY_CARD_ID,
  SELECT_FILE_URLS_BY_CARD_ID,
  SELECT_CARD_EXISTS_BY_ID,
  INSERT_FILE_QUERY,
  UPDATE_CARD_UPDATED_AT,
  SELECT_FILE_BY_ID_AND_CARD_ID,
  DELETE_FILE_BY_ID_AND_CARD_ID,
  SELECT_FILE_BY_ID,
} from '../database/queries.js'

export const getCardFiles = async (req, res) => {
  try {
    const { cardId } = req.params

    const files = await allQuery(SELECT_FILES_BY_CARD_ID, [cardId])

    res.json(files)
  } catch (error) {
    console.error('Error getting card files:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const addFilesToCard = async (req, res) => {
  try {
    const { cardId } = req.params
    const { files } = req.body

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: 'Files array is required' })
    }

    const cardExists = await getQuery(SELECT_CARD_EXISTS_BY_ID, [cardId])

    if (!cardExists) {
      return res.status(404).json({ error: 'Card not found' })
    }

    const existingFiles = await allQuery(SELECT_FILE_URLS_BY_CARD_ID, [cardId])

    const existingUrls = new Set(existingFiles.map((f) => f.url))

    const newFiles = files.filter((file) => !existingUrls.has(file.url))

    if (newFiles.length === 0) {
      const allFiles = await allQuery(SELECT_FILES_BY_CARD_ID, [cardId])
      return res.status(200).json({
        message: 'No new files to add',
        files: allFiles,
        addedCount: 0,
      })
    }

    const insertPromises = newFiles.map((file) =>
      runQuery(INSERT_FILE_QUERY, [file.id, file.type, file.url, cardId]),
    )

    await Promise.all(insertPromises)

    await runQuery(UPDATE_CARD_UPDATED_AT, [new Date().toISOString(), cardId])

    const allFiles = await allQuery(SELECT_FILES_BY_CARD_ID, [cardId])

    res.status(200).json({
      message: 'Files added successfully',
      files: allFiles,
      addedCount: newFiles.length,
    })
  } catch (error) {
    console.error('Error adding files to card:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const removeFileFromCard = async (req, res) => {
  try {
    const { cardId, fileId } = req.params

    const file = await getQuery(SELECT_FILE_BY_ID_AND_CARD_ID, [fileId, cardId])

    if (!file) {
      return res.status(404).json({ error: 'File not found' })
    }

    await runQuery(DELETE_FILE_BY_ID_AND_CARD_ID, [fileId, cardId])

    await runQuery(UPDATE_CARD_UPDATED_AT, [new Date().toISOString(), cardId])

    res.status(200).json({ message: 'File removed successfully' })
  } catch (error) {
    console.error('Error removing file from card:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getFileById = async (req, res) => {
  try {
    const { fileId } = req.params

    const file = await getQuery(SELECT_FILE_BY_ID, [fileId])

    if (!file) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.json(file)
  } catch (error) {
    console.error('Error getting file:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
