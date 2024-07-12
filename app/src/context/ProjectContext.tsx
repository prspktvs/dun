import { createContext, useContext, useEffect, useState } from 'react'
import { ITask } from '../types/Task'
import { useAuth } from './AuthContext'
import { createCard, getAllUserTasks, getProjectCards, removeCard, updateCard } from '../services'

import { updateUser } from '../services/user.service'
import io from 'socket.io-client'
import { BACKEND_URL } from '../constants/app'
import { ICard } from '../types/Card'
import { useFirebaseDocument } from '../hooks/useFirebaseDocument'
import { IProject } from '../types/Project'

export type ProjectContext = {
  project: IProject
  cards: ICard[]
  tasks: ITask[]
  isLoading: boolean
  optimisticCreateCard: (card: Partial<ICard>) => Promise<void>
  optimisticUpdateCard: (card: Partial<ICard>) => Promise<void>
  optimisticDeleteCard: (cardId: string) => Promise<void>
}

export const ProjectProvider = ({
  projectId,
  children,
}: {
  projectId: string
  children: React.ReactNode
}) => {
  const { user } = useAuth()
  const [cards, setCards] = useState<ICard[]>([])
  const [tasks, setTasks] = useState<ITask[]>([])

  const { data: project, loading: isLoading } = useFirebaseDocument(`projects/${projectId}`)

  useEffect(() => {
    if (!projectId || !user) return
    async function fetchData() {
      await getAllUserTasks(projectId, user).then((data) => setTasks(data))
      await getProjectCards(projectId).then((data) => setCards(data))

      const updatedUser = { ...user, lastProjectId: projectId }
      await updateUser(updatedUser)
    }

    fetchData()

    const socket = io(BACKEND_URL)
    socket.emit('subscribe', { userId: user?.id })
    socket.emit('joinProject', { projectId })

    socket.on('update_tasks', (data) => {
      const { deletedTasks, updatedTasks } = data

      if (deletedTasks.length > 0) {
        setTasks((prev) => prev.filter((task) => !deletedTasks.includes(task.id)))
      }

      if (updatedTasks.length > 0) {
        setTasks((prev) => {
          const t: ITask[] = [...prev]
          updatedTasks.forEach((task: ITask) => {
            const index = prev.findIndex((t) => t.id === task.id)
            if (index > -1) {
              t[index] = task
            } else {
              t.push(task)
            }
          })

          return t
        })
      }
    })

    socket.on('update_cards', (data) => {
      setCards((prev) => {
        return prev.map((card) => (card.id === data.id ? { ...card, ...data } : card))
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [projectId, user])

  const optimisticCreateCard = async (card: Partial<ICard>) => {
    try {
      const newCard = await createCard(projectId, card)
      if (!newCard) return
      setCards((prev) => [...prev, newCard])
    } catch (error) {}
  }

  const optimisticUpdateCard = async (card: ICard) => {
    try {
      await updateCard(card)
      setCards((prev) => {
        const index = prev.findIndex((c) => c.id === card.id)
        if (index > -1) {
          prev[index] = card
        }
        return prev
      })
    } catch (error) {}
  }

  const optimisticDeleteCard = async (cardId: string) => {
    try {
      await removeCard(cardId)
      setCards((prev) => prev.filter((card) => card.id !== cardId))
    } catch (error) {}
  }

  const contextValue: ProjectContext = {
    project,
    cards,
    tasks,
    isLoading,
    optimisticCreateCard,
    optimisticUpdateCard,
    optimisticDeleteCard,
  }
  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
}

export const ProjectContext = createContext<ProjectContext | undefined>(undefined)

export const useProject = (): ProjectContext => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
