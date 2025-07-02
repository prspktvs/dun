import clsx from 'clsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import { useProject } from '../../context/ProjectContext'
import { ICard } from '../../types/Card'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import CardPreview from '../../components/Card/CardPreview'
import { genId } from '../../utils'
import { useSearch } from '../../components/ui/Search'
import { Loader } from '../../components/ui/Loader'
import ProjectSelector from '../../components/Project/ProjectSelector'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import UserPanel from '../../components/User/UserPanel'
import SearchBar from '../../components/Project/SearchBar'
import { logAnalytics } from '../../utils/analytics'
import { ANALYTIC_EVENTS } from '../../constants'
import { ROLES } from '../../constants/roles.constants'
import KanbanBoard from '../../components/Kanban/KanbanBoard'
import { getProjectTasks, updateTask } from '../../services/index'
import { ITask } from '../../types/Task'
import { apiRequest } from '../../utils/api'

function SortButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx('px-4 py-2 rounded', isActive ? 'bg-grayBg' : 'text-[#969696]')}
    >
      <span className='text-[#555555] text-xs font-normal font-monaspace'>{children}</span>
    </button>
  )
}

export function KanbanPage() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { hasPermission } = useProject()

  const canCreateCard = hasPermission(ROLES.EDITOR)

  const {
    setSortType,
    sortType,
    cards,
    search: searchText,
    setSearch,
    optimisticCreateCard,
  } = useProject()
  const search = useSearch(searchText, projectId)

  const [tasks, setTasks] = useState<ITask[]>([])

  const fetchTasks = async () => {
    try {
      const tasks = await getProjectTasks(projectId, 0, 0, 1000)
      const doneTasks = await getProjectTasks(projectId, 1, 0, 1000)

      const allTasks = [...tasks, ...doneTasks].filter(
        (task, index, self) => index === self.findIndex((t) => t.id === task.id),
      )
      setTasks(allTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }
  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const cardsWithTasks = cards
    .map((card) => {
      const cardTasks = tasks.filter((task) => task.card_id === card.id)
      return { ...card, tasks: cardTasks }
    })
    .filter((card) => {
      return (
        card.tasks.length > 0 ||
        (searchText.length && card.title.toLowerCase().includes(searchText.toLowerCase()))
      )
    })

  useEffect(() => {
    logAnalytics(ANALYTIC_EVENTS.PAGE_OPEN, { page: 'project_cards', projectId })
  }, [])

  const goBack = () => {
    navigate(`/${projectId}`)
  }

  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  const onChooseTask = (task: ITask) => {
    const taskId = task.id.split('_').pop()
    navigate(`/${projectId}/cards/${task.card_id}?taskId=${taskId}`)
  }

  const setTasksImpl = async (newTasks: ITask[]) => {
    if (isEmpty(newTasks)) {
      setTasks([])
      return
    }

    const currentTasks = [...tasks]

    setTasks(newTasks)

    try {
      const tasksToUpdate = newTasks.filter((task) => {
        const currentTask = currentTasks.find((t) => t.id === task.id)
        return (
          !currentTask ||
          currentTask.position !== task.position ||
          currentTask.status !== task.status ||
          currentTask.card_id !== task.card_id
        )
      })

      if (tasksToUpdate.length > 0) {
        await Promise.all(
          tasksToUpdate.map((task) =>
            apiRequest(`tasks/${task.id}/order`, {
              method: 'PATCH',
              body: JSON.stringify({
                order: task.position,
                card_id: task.card_id,
                status: task.status,
              }),
            })
              .then((response) => {
                console.log(`Updated task ${task.id}:`, response)
                return response
              })
              .catch((error) => {
                console.error(`Failed to update task ${task.id}:`, error)
                throw error
              }),
          ),
        )
      }
    } catch (error) {
      console.error('Failed to update tasks:', error)
    }
  }

  const updateTaskImpl = async (task: ITask) => {
    try {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === task.id)
        if (index > -1) {
          const newTasks = [...prev]
          newTasks[index] = task
          return newTasks
        }
        return [...prev, task]
      })

      const updatedTask = await updateTask(task, projectId)

      setTasks((prev) => {
        return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      })

      return updatedTask
    } catch (error) {
      console.error('Failed to update task:', error)
      return task
    }
  }

  return (
    <div className='w-full h-full pb-32 overflow-hidden'>
      <KanbanBoard
        projectId={projectId}
        tasks={tasks}
        setTasks={setTasksImpl}
        updateTask={updateTaskImpl}
        topics={cardsWithTasks}
        onChooseTask={onChooseTask}
        goBack={goBack}
      />
    </div>
  )
}
