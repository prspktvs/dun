import { useEffect, useState, useMemo, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  closestCenter,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { SwimLane } from './types/task'
import { TaskStatus } from './types/task'
import type { Task } from './types/task'
import SwimLaneRow from './SwimLaneRow'
import TaskCard from './TaskCard'
import { apiRequest } from '../../utils/api'

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export default function KanbanBoard({
  projectId,
  tasks,
  topics,
  goBack,
  onChooseTask,
  setTasks,
  updateTask,
}: {
  projectId: string
  tasks: Task[]
  topics: SwimLane[]
  goBack: () => void
  onChooseTask: (task: Task) => void
  setTasks: (tasks: Task[]) => void
  updateTask: (task: Task) => void
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeContainer, setActiveContainer] = useState<string | null>(null)
  const [overContainer, setOverContainer] = useState<string | null>(null)
  const [lastOverId, setLastOverId] = useState<string | null>(null)
  const [clonedTasks, setClonedTasks] = useState<Task[]>(tasks)
  const [invalidDrop, setInvalidDrop] = useState<boolean>(false)
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({})

  const prevCountsRef = useRef<Record<string, number>>({})

  useEffect(() => {
    setClonedTasks(tasks)
  }, [tasks])

  const taskCountsByStatus = useMemo(() => {
    const statusMap = {
      Planned: TaskStatus.Planned,
      NoStatus: TaskStatus.NoStatus,
      InProgress: TaskStatus.InProgress,
      InReview: TaskStatus.InReview,
      Done: TaskStatus.Done,
    }

    const counts = {} as Record<string, number>

    Object.keys(TaskStatus).forEach((key) => {
      counts[key] = 0
    })

    tasks.forEach((task) => {
      const enumKey = Object.entries(statusMap).find(([_, value]) => value === task.status)?.[0]

      if (enumKey) {
        counts[enumKey]++
      }

      if (task.isDone && enumKey !== 'Done') {
        counts['Done']++
      }
    })

    return counts
  }, [tasks])

  const changedCounts = useMemo(() => {
    const changed = {} as Record<string, boolean>

    Object.keys(TaskStatus).forEach((status) => {
      if (prevCountsRef.current[status] !== taskCountsByStatus[status]) {
        changed[status] = true
      }
    })

    return changed
  }, [taskCountsByStatus])

  useEffect(() => {
    prevCountsRef.current = { ...taskCountsByStatus }
  }, [taskCountsByStatus])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  )

  const findContainer = (id: string) => {
    const task = tasks.find((task) => task.id === id)
    return task ? `${task.card_id}-${task.status}` : id.includes('-') ? id : null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeTaskId = active.id as string

    setClonedTasks(JSON.parse(JSON.stringify(tasks)))

    const task = tasks.find((t) => t.id === activeTaskId)
    if (task) {
      setActiveTask({ ...task })
      setActiveId(activeTaskId)
      const container = findContainer(activeTaskId)
      setActiveContainer(container)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (!over) return

    const overId = over.id as string
    setLastOverId(overId)

    const overContainer = findContainer(overId)
    if (overContainer) {
      setOverContainer(overContainer)

      if (activeContainer) {
        const [activeCardId, activeStatus] = activeContainer.split('-')
        const [overCardId, overStatus] = overContainer.split('-')

        setInvalidDrop(activeCardId !== overCardId || collapsedColumns[overStatus] === true)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active) {
      resetDragState()
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeTaskItem = tasks.find((task) => task.id === activeId)
    if (!activeTaskItem) {
      resetDragState()
      return
    }

    const fromContainer = `${activeTaskItem.card_id}-${activeTaskItem.status}`
    const toContainer = findContainer(overId) || fromContainer

    const [fromCardId, fromStatus] = fromContainer.split('-')
    const [toCardId, toStatus] = toContainer.split('-')

    const statusMap = {
      Planned: TaskStatus.Planned,
      NoStatus: TaskStatus.NoStatus,
      InProgress: TaskStatus.InProgress,
      InReview: TaskStatus.InReview,
      Done: TaskStatus.Done,
    }

    const newTasks = JSON.parse(JSON.stringify(tasks))

    if (fromStatus !== toStatus) {
      const activeIndex = newTasks.findIndex((t) => t.id === activeId)

      if (activeIndex !== -1) {
        const newStatus = statusMap[toStatus] || toStatus

        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          status: newStatus,
          position: 0,
        }

        const containerTasks = newTasks.filter(
          (t) => t.card_id === fromCardId && t.status === newStatus && t.id !== activeId,
        )

        containerTasks.forEach((task, index) => {
          const taskIndex = newTasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            newTasks[taskIndex].position = (index + 1) * 1000
          }
        })
      }
    } else if (activeId !== overId) {
      const containerTasks = newTasks.filter(
        (t) => t.card_id === fromCardId && t.status === fromStatus,
      )

      const activeIndex = containerTasks.findIndex((t) => t.id === activeId)
      const overIndex = containerTasks.findIndex((t) => t.id === overId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedTasks = arrayMove([...containerTasks], activeIndex, overIndex)

        for (let i = 0; i < reorderedTasks.length; i++) {
          const taskId = reorderedTasks[i].id
          const taskIndex = newTasks.findIndex((t) => t.id === taskId)
          if (taskIndex !== -1) {
            newTasks[taskIndex].position = i * 1000
          }
        }
      }
    }

    setTasks(newTasks)

    resetDragState()
  }

  const resetDragState = () => {
    setActiveTask(null)
    setActiveId(null)
    setActiveContainer(null)
    setOverContainer(null)
    setLastOverId(null)
    setInvalidDrop(false)
  }

  const onToggleCheck = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
        status: !task.isDone ? TaskStatus.Done : task.status,
      }

      const newTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))

      setTasks(newTasks)

      updateTask(updatedTask)
    }
  }

  const toggleColumn = (columnId: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  useEffect(() => {
    const savedPrefs = localStorage.getItem(`kanban-columns-${projectId}`)
    if (savedPrefs) {
      try {
        setCollapsedColumns(JSON.parse(savedPrefs))
      } catch (e) {
        console.error('Failed to parse saved column preferences', e)
      }
    }
  }, [projectId])

  useEffect(() => {
    localStorage.setItem(`kanban-columns-${projectId}`, JSON.stringify(collapsedColumns))
  }, [collapsedColumns, projectId])

  return (
    <div className='flex flex-col h-screen w-full bg-white pb-20'>
      <div className='flex items-center p-4 border-b border-gray-200'>
        <button onClick={goBack} className='flex items-center text-gray-600 hover:text-gray-900'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Back
        </button>
      </div>

      <div className='flex sticky top-0 z-20 bg-white'>
        <div className='flex-shrink-0 w-[200px] h-[56px] flex items-center p-4 font-medium text-gray-700 border-b border-r border-gray-200'>
          <span>Topic</span>
        </div>
        <div className='flex flex-1'>
          {['NoStatus', 'Planned', 'InProgress', 'InReview', 'Done'].map((status) => (
            <div
              key={status}
              className={`${
                collapsedColumns[status] ? 'w-[60px]' : 'flex-1 min-w-[180px]'
              } h-[56px] flex items-center justify-between p-4 font-medium text-gray-700 border-b border-r border-gray-200 transition-all duration-300`}
            >
              <div className='flex items-center space-x-2 overflow-hidden'>
                {!collapsedColumns[status] ? (
                  <>
                    <span className='truncate'>{status.replace(/([A-Z])/g, ' $1')}</span>
                    <span className='text-gray-500'>•</span>
                    <span className='text-gray-500'>{taskCountsByStatus[status] || 0}</span>
                  </>
                ) : (
                  <span
                    style={{
                      writingMode: 'vertical-lr',
                      transform: 'rotate(180deg)',
                      whiteSpace: 'nowrap',
                    }}
                    className='text-xs'
                  >
                    {status.replace(/([A-Z])/g, ' $1')} ({taskCountsByStatus[status] || 0})
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleColumn(status)}
                className='ml-auto text-gray-500 hover:text-gray-700 flex-shrink-0'
                title={collapsedColumns[status] ? 'Expand column' : 'Collapse column'}
              >
                {collapsedColumns[status] ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className='flex-1 overflow-auto w-full'
        style={{
          overscrollBehavior: 'contain',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className='w-full'>
            {topics.map((swimLane) => {
              const swimLaneTasks = tasks
                .filter((task) => task.card_id === swimLane.id)
                .sort((a, b) => (a.position || 0) - (b.position || 0))

              return (
                <SwimLaneRow
                  key={swimLane.id}
                  swimLane={swimLane}
                  tasks={swimLaneTasks}
                  onToggleCheck={onToggleCheck}
                  activeId={activeId}
                  activeContainer={activeContainer}
                  overContainer={overContainer}
                  lastOverId={lastOverId}
                  onChooseTask={onChooseTask}
                  collapsedColumns={collapsedColumns}
                />
              )
            })}
          </div>

          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask && (
              <div className='w-[260px]'>
                <TaskCard
                  task={activeTask}
                  onToggleCheck={onToggleCheck}
                  isDragOverlay
                  isInvalidDrop={invalidDrop}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
