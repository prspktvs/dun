import React, { createContext, useContext, useState, useCallback } from 'react'

import { IFile } from '../types/File'
import { getCardFiles, addFilesToCard as addFilesToCardAPI } from '../services/card.service'

interface CardFilesContextType {
  files: IFile[]
  loading: boolean
  error: string | null
  refreshFiles: () => Promise<void>
  addFiles: (files: IFile[]) => Promise<void>
}

const CardFilesContext = createContext<CardFilesContextType | undefined>(undefined)

export const CardFilesProvider: React.FC<{
  cardId: string
  children: React.ReactNode
}> = ({ cardId, children }) => {
  const [files, setFiles] = useState<IFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshFiles = useCallback(async () => {
    if (!cardId) {
      setFiles([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const cardFiles = await getCardFiles(cardId)
      setFiles(cardFiles)
    } catch {
      setError('Failed to load files')
      setFiles([])
    } finally {
      setLoading(false)
    }
  }, [cardId])

  const addFiles = useCallback(
    async (newFiles: IFile[]) => {
      if (!cardId || !newFiles.length) return

      try {
        const result = await addFilesToCardAPI(cardId, newFiles)
        if (result) {
          setFiles(result.files)
        }
      } catch (error) {
        console.error('Failed to add files:', error)

        await refreshFiles()
      }
    },
    [cardId, refreshFiles],
  )

  React.useEffect(() => {
    refreshFiles()
  }, [refreshFiles])

  const contextValue: CardFilesContextType = {
    files,
    loading,
    error,
    refreshFiles,
    addFiles,
  }

  return <CardFilesContext.Provider value={contextValue}>{children}</CardFilesContext.Provider>
}

export const useCardFiles = (): CardFilesContextType => {
  const context = useContext(CardFilesContext)
  if (!context) {
    throw new Error('useCardFiles must be used within a CardFilesProvider')
  }
  return context
}
