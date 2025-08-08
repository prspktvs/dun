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
  const [collapsedSwimLanes, setCollapsedSwimLanes] = useState<Record<string, boolean>>({})
  const [hoveringColumn, setHoveringColumn] = useState<string | null>(null)

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
    const { active, over } = event
    if (!over) return

    const overId = over.id as string
    setLastOverId(overId)

    const overContainer = findContainer(overId)
    setOverContainer(overContainer)
    setHoveringColumn(overContainer)

    if (activeContainer && overContainer) {
      const [activeCardId] = activeContainer.split('-')
      const [overCardId] = overContainer.split('-')

      if (activeCardId !== overCardId) {
        setInvalidDrop(true)
        return
      }
      setInvalidDrop(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !active || invalidDrop) {
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

    const newTasks = tasks.map((task) => ({ ...task }))

    if (fromContainer === toContainer) {
      const containerTasks = newTasks
        .filter((t) => t.card_id === fromCardId && t.status === fromStatus)
        .sort((a, b) => (a.position || 0) - (b.position || 0))

      const activeIndex = containerTasks.findIndex((task) => task.id === activeId)
      const overIndex = containerTasks.findIndex((task) => task.id === overId)

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedTasks = arrayMove(containerTasks, activeIndex, overIndex)

        reorderedTasks.forEach((task, index) => {
          const taskIndex = newTasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            newTasks[taskIndex].position = index * 1000
          }
        })
      }
    } else {
      const activeIndex = newTasks.findIndex((task) => task.id === activeId)
      if (activeIndex !== -1) {
        const newStatus = statusMap[toStatus] || toStatus
        const toCardId = toContainer.split('-')[0]

        const overTaskIndex = newTasks.findIndex((task) => task.id === overId)

        let newPosition
        if (overTaskIndex !== -1) {
          newPosition = newTasks[overTaskIndex].position - 1
        } else {
          const targetContainerTasks = newTasks.filter(
            (task) => task.card_id === toCardId && task.status === newStatus,
          )
          newPosition =
            targetContainerTasks.length > 0
              ? targetContainerTasks[targetContainerTasks.length - 1].position + 1
              : 0
        }

        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          card_id: toCardId,
          status: newStatus,
          position: newPosition,
          isDone: newStatus === TaskStatus.Done ? true : false,
        }

        updateTask(newTasks[activeIndex])

        const targetContainerTasks = newTasks
          .filter((task) => task.card_id === toCardId && task.status === newStatus)
          .sort((a, b) => (a.position || 0) - (b.position || 0))

        targetContainerTasks.forEach((task, index) => {
          const taskIndex = newTasks.findIndex((t) => t.id === task.id)
          if (taskIndex !== -1) {
            newTasks[taskIndex].position = index * 1000
          }
        })
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
    setHoveringColumn(null)
  }

  const onToggleCheck = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      let newStatus
      if (task.isDone) {
        newStatus = TaskStatus.NoStatus
      } else {
        newStatus = TaskStatus.Done
      }
      const updatedTask = {
        ...task,
        isDone: !task.isDone,
        status: newStatus,
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

  const toggleSwimLane = (swimLaneId: string) => {
    setCollapsedSwimLanes((prev) => ({
      ...prev,
      [swimLaneId]: !prev[swimLaneId],
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

  useEffect(() => {
    const savedPrefs = localStorage.getItem(`kanban-swimlanes-${projectId}`)
    if (savedPrefs) {
      try {
        setCollapsedSwimLanes(JSON.parse(savedPrefs))
      } catch (e) {
        console.error('Failed to parse saved swimlane preferences', e)
      }
    }
  }, [projectId])

  useEffect(() => {
    localStorage.setItem(`kanban-swimlanes-${projectId}`, JSON.stringify(collapsedSwimLanes))
  }, [collapsedSwimLanes, projectId])

  return (
    <div className='flex  flex-col h-screen w-full bg-white'>
      <div className='flex-1 flex flex-col w-full overflow-auto pb-14'>
        <div className='sticky top-0 z-30 flex items-center p-4 border-b border-gray-200 bg-white'>
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
            Back to topics
          </button>
        </div>
        <div className='flex sticky top-[60px] z-20 bg-white shadow-sm'>
          <div className='flex-shrink-0 w-[200px] h-[56px] flex items-center justify-between p-4 font-medium text-gray-700 border-b border-r border-gray-200'>
            <span>Topic</span>
            <button
              onClick={() => {
                const allCollapsed = topics.every((t) => collapsedSwimLanes[t.id])
                const newState = topics.reduce(
                  (acc, topic) => {
                    acc[topic.id] = !allCollapsed
                    return acc
                  },
                  {} as Record<string, boolean>,
                )
                setCollapsedSwimLanes(newState)
              }}
              className='text-gray-500 hover:text-gray-700'
              title='Toggle all rows'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12z' />
                <path d='M15 8a1 1 0 00-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z' />
              </svg>
            </button>
          </div>
          <div className='flex flex-1'>
            {(() => {
              const statuses = ['NoStatus', 'Planned', 'InProgress', 'InReview', 'Done']
              const collapsedCount = statuses.filter((status) => collapsedColumns[status]).length
              const allCollapsed = collapsedCount === statuses.length

              return statuses.map((status, index, arr) => {
                const isCollapsed = collapsedColumns[status]
                let columnClass = ''
                if (isCollapsed) {
                  columnClass = allCollapsed ? 'flex-1 min-w-0' : 'w-[150px]'
                } else {
                  columnClass = 'flex-1 min-w-[180px]'
                }
                return (
                  <div
                    key={status}
                    className={`${columnClass} h-[56px] flex items-center justify-between p-4 font-medium text-gray-700 border-b ${
                      index < arr.length - 1 ? 'border-r' : ''
                    } border-gray-200 transition-all duration-300`}
                  >
                    <div className='flex items-center space-x-2 overflow-hidden'>
                      {!isCollapsed ? (
                        <span className='truncate'>{status.replace(/([A-Z])/g, ' $1')}</span>
                      ) : (
                        <span className='text-xs'>{status.replace(/([A-Z])/g, ' $1')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleColumn(status)}
                      className='ml-auto text-gray-500 hover:text-gray-700 flex-shrink-0'
                      title={isCollapsed ? 'Expand column' : 'Collapse column'}
                    >
                      {isCollapsed ? (
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
                )
              })
            })()}
          </div>
        </div>
        <div
          className='flex-1 w-full'
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
                    isCollapsed={collapsedSwimLanes[swimLane.id] || false}
                    activeTask={activeTask}
                    onToggleCollapse={() => toggleSwimLane(swimLane.id)}
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
    </div>
  )
}
