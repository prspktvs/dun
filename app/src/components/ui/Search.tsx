import { useState, useEffect } from 'react'

import { ICard } from '../../types/Card'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'https://api.dun.wtf'

async function searchCards(q: string, projectId: string) {
  return fetch(`${BACKEND_URL}/api/cards/search?q=${q}&project_id=${projectId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((res) => res.json())
}

export const useSearch = (search: string, projectId: string) => {
  const [results, setResults] = useState<ICard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!search) {
      setResults([])
      return
    }

    setLoading(true)

    searchCards(search, projectId)
      .then((cards) => setResults(cards))
      .finally(() => {
        setLoading(false)
      })
  }, [search])

  return { q: search, results, loading }
}
