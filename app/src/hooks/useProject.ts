import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ICard, IProject, ProjectData } from '../types'
import { getProjectCards } from '../services'

export function useProject() {
  const { id } = useParams()
  const [cards, setCards] = useState<ICard[]>([])
  const [project, setProject] = useState<IProject | null>(null)

  useEffect(() => {
    if (id) {
      getProjectCards(id).then((data: ProjectData | null) => {
        if (data) {
          setCards(data.cards)
          setProject(data.project)
        }
      })
    }
  }, [id])

  return { cards, project }
} 