import { useState, useEffect, useCallback } from 'react'

import { IFile } from '../types/File'
import { getCardFiles } from '../services/card.service'

export const useCardFiles = (cardId: string | undefined, refreshTrigger?: any) => {
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

  useEffect(() => {
    refreshFiles()
  }, [refreshFiles, refreshTrigger])

  return {
    files,
    loading,
    error,
    refreshFiles
  }
}
