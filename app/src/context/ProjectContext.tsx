import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { get, off, onValue, ref } from 'firebase/database'

import { ITask } from '../types/Task'
import { useAuth } from './AuthContext'
import {
  addUserToProject,
  createCard,
  getAllUserTasks,
  getProjectCards,
  removeCard,
  updateCard,
} from '../services'
import { updateUser } from '../services/user.service'
import { ICard } from '../types/Card'
import { useFirebaseDocument } from '../hooks/useFirebaseDocument'
import { IProject } from '../types/Project'
import { getWsUrl } from '../utils/index'
import { IUser } from '../types/User'
import { realtimeDb } from '../config/firebase'
import { IMessage } from '../types/Chat'

export type ProjectContext = {
  project: IProject
  cards: ICard[]
  tasks: ITask[]
  users: IUser[]
  author: IUser['id']
  isLoading: boolean
  search: string
  sortType: 'createdAt' | 'updatedAt'
  setSearch: (search: string) => void
  setSortType: (type: 'createdAt' | 'updatedAt') => void
  updateCard: (card: Partial<ICard>) => void
  optimisticCreateCard: (card: Partial<ICard>) => Promise<void>
  optimisticUpdateCard: (card: Partial<ICard>) => Promise<void>
  optimisticDeleteCard: (cardId: string) => Promise<void>
  getUnreadCardMessagesCount: (id: string) => number
}

export const ProjectProvider = ({
  projectId,
  children,
}: {
  projectId: string
  children: React.ReactNode
}) => {
  const { user, token } = useAuth()
  const [cards, setCards] = useState<ICard[]>([])
  const [tasks, setTasks] = useState<ITask[]>([])
  const [search, setSearch] = useState('')
  const [sortType, setSortType] = useState<ProjectContext['sortType']>('createdAt')
  const [unreadChats, setUnreadChats] = useState<{ id: string; unreadCount: number }[]>([])

  const { data: project, loading: isLoading } = useFirebaseDocument(`projects/${projectId}`)

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats`)
    get(messagesRef).then((snapshot) => {
      const messageData: { id: string; content: string; messages: IMessage[] } = snapshot.val()
      const lastReadMessages = JSON.parse(localStorage.getItem('lastReadMessages'))
      const allChats = Object.values(messageData)
      const data: { id: string; unreadCount: number }[] = allChats.map((chat) => {
        if (!chat || !chat?.id || !chat?.messages) return { id: '', unreadCount: 0 }
        const messagesIds = Object.keys(chat.messages)
        const unreadCount =
          lastReadMessages && lastReadMessages.hasOwnProperty(chat.id)
            ? messagesIds.length - 1 - messagesIds.indexOf(lastReadMessages[chat.id])
            : messagesIds.length
        return { id: chat.id, unreadCount }
      })

      setUnreadChats(data)
    })

    return () => off(messagesRef)
  }, [])

  useEffect(() => {
    if (!projectId) return
    async function fetchData() {
      const allCards = await getProjectCards(projectId, sortType)
      setCards(allCards)
    }

    fetchData()
  }, [projectId, sortType])

  useEffect(() => {
    if (!projectId || !user) return
    async function fetchData() {
      const updatedUser = { ...user, lastProjectId: projectId }

      const [allTasks] = await Promise.all([
        getAllUserTasks(projectId, user),
        updateUser(updatedUser),
      ])
      setTasks(allTasks)
    }

    fetchData()

    addUserToProject(projectId, user)

    // Firefox thows an error if the url has http:// instead ls ws://
    const wsHost = getWsUrl(process.env.VITE_BACKEND_URL)
    const wsUrl = `${wsHost}/updates?userId=${user.id}&projectId=${projectId}&token=${token}`

    const ws = new WebSocket(wsUrl)
    ws.onopen = () => {
      console.log('WebSocket connected')
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (!data) return

      switch (data.type) {
        case 'tasks': {
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
          break
        }
        case 'card': {
          setCards((prev) => {
            return prev.map((card) => (card.id === data.id ? { ...card, ...data } : card))
          })
          break
        }
      }
    }
    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }
    ws.onerror = (err) => console.error('WebSocket error', err)

    return () => ws.close()
  }, [projectId, user])

  const getUnreadCardMessagesCount = (id: string) => {
    const message = unreadChats.find((chat) => chat.id === id)
    return message && message?.unreadCount ? message?.unreadCount : 0
  }

  const optimisticCreateCard = async (card: Partial<ICard>) => {
    try {
      const data = { ...card, author: user.id, users: [], public: false }
      const newCard = await createCard(projectId, data)
      if (!newCard) return
      setCards((prev) => [newCard, ...prev])
    } catch (error) {}
  }

  const optimisticUpdateCard = async (card: Partial<ICard>) => {
    try {
      await updateCard(card)
      _updateCard(card)
    } catch (error) {}
  }

  const optimisticDeleteCard = async (cardId: string) => {
    try {
      setCards((prev) => prev.filter((card) => card.id !== cardId))
      await removeCard(cardId)
    } catch (error) {}
  }

  const _updateCard = (card: Partial<ICard>) => {
    setCards((prev) => {
      const updatedCards = prev.map((c) => {
        if (c.id === card.id) {
          return { ...c, ...card }
        }
        return c
      })
      return updatedCards
    })
  }

  const contextValue: ProjectContext = {
    project,
    users: project?.users || [],
    author: project?.author,
    search,
    cards,
    tasks,
    isLoading,
    sortType,
    setSortType,
    setSearch,
    updateCard: _updateCard,
    optimisticCreateCard,
    optimisticUpdateCard,
    optimisticDeleteCard,
    getUnreadCardMessagesCount,
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
