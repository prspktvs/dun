import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { get, off, onValue, ref } from 'firebase/database'

import { ITask } from '../types/Task'
import { useAuth } from './AuthContext'
import { createCard, getAllUserTasks, getProjectCards, removeCard, updateCard } from '../services'
import { updateUser } from '../services/user.service'
import { ICard } from '../types/Card'
import { useFirebaseDocument } from '../hooks/useFirebaseDocument'
import { IProject } from '../types/Project'
import { getWsUrl } from '../utils/index'
import { ITeamMember, IUser } from '../types/User'
import { realtimeDb } from '../config/firebase'
import { ROLE_LEVELS, UserRole } from '../constants/roles.constants'
import { ONBOARDING_ID } from '../constants/routes.constants'

export type ProjectContext = {
  project: IProject
  cards: ICard[]
  tasks: ITask[]
  users: ITeamMember[]
  usersMap: Record<string, ITeamMember>
  role: UserRole
  author: IUser['id']
  isLoading: boolean
  isCardsLoading: boolean
  isOnboarding: boolean
  search: string
  sortType: 'createdAt' | 'updatedAt'
  hasPermission: (minRole: UserRole) => boolean
  setSearch: (search: string) => void
  setTasks: (tasks: ITask[]) => void
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
  const [isCardsLoading, setIsCardsLoading] = useState(true)

  const { data: project, loading: isLoading } = useFirebaseDocument(`projects/${projectId}`)

  const role: UserRole = useMemo(
    () => project?.users?.find((u) => u.id === user?.id)?.role,
    [project, user],
  )

  const hasPermission = (minRole: UserRole) => {
    if (!role) return false
    return ROLE_LEVELS[role] >= ROLE_LEVELS[minRole]
  }

  const usersMap = useMemo(() => {
    const map: Record<string, IUser> = {}
    if (project?.users) {
      project.users.forEach((u) => {
        map[u.id] = u
      })
    }
    return map
  }, [project?.users])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const projectChatsRef = ref(realtimeDb, `projects/${projectId}/cards`)
        const snapshot = await get(projectChatsRef)
        const cards = snapshot.val()
        if (!cards) return []

        const allChats = []
        Object.entries(cards).forEach(([cardId, card]) => {
          if (card.chats) {
            Object.entries(card.chats).forEach(([chatId, chat]) => {
              allChats.push({ cardId, chatId, chat })
            })
          }
        })

        const data = allChats.map(({ cardId, chat }) => {
          if (!chat || !chat.id || !chat.messages) return { cardId, chatId: '', unreadCount: 0 }
          const messages = Object.values(chat.messages)
          const unreadCount = messages.filter(
            (message) => !message.readBy || !message.readBy.includes(user.id),
          ).length
          return { cardId, chatId: chat.id, unreadCount }
        })

        setUnreadChats(data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }

    fetchChats()

    return () => {
      const projectChatsRef = ref(realtimeDb, `projects/${projectId}/cards`)
      off(projectChatsRef)
    }
  }, [projectId, user?.id])

  useEffect(() => {
    if (!projectId) return
    async function fetchData() {
      const allCards = await getProjectCards(projectId, sortType)
      const nonEmptyCards = allCards.filter(
        (card) =>
          card.title ||
          card?.description?.length > 0 ||
          card?.tasks?.length > 0 ||
          card?.files?.length > 0,
      )

      setCards(nonEmptyCards)
      setIsCardsLoading(false)
    }

    fetchData()
  }, [projectId, sortType, token])

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
          console.log(updatedTasks)
          if (deletedTasks?.length > 0) {
            setTasks((prev) => prev.filter((task) => !deletedTasks.includes(task.id)))
          }

          if (updatedTasks?.length > 0) {
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
  }, [projectId, user?.id])

  const getUnreadCardMessagesCount = (cardId: string) => {
    const chatsInCard = unreadChats.filter((chat) => chat.cardId === cardId)
    return chatsInCard.reduce((acc, chat) => acc + chat.unreadCount, 0)
  }

  const optimisticCreateCard = async (card?: Partial<ICard>) => {
    try {
      const createdAt = new Date()
      const data = {
        ...card,
        title: '',
        public: false,
        author: user.id,
        users: [],
        chatIds: [],
        createdAt,
        updatedAt: createdAt,
      }

      const newCard = await createCard(projectId, data)

      if (!newCard) return
      setCards((prev) => [newCard, ...prev])
    } catch (error) {}
  }

  const optimisticUpdateCard = async (card: Partial<ICard>) => {
    try {
      const updatedCard = await updateCard(card)

      if (!updatedCard) return
      _updateCard(updatedCard)
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
    usersMap,
    author: project?.author,
    search,
    cards,
    tasks,
    setTasks,
    role,
    hasPermission,
    isLoading,
    isCardsLoading,
    isOnboarding: projectId === ONBOARDING_ID,
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
