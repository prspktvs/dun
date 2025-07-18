import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import clsx from 'clsx'

import { type Task, TaskStatus, TaskPriority, SwimLane } from './types/task'
import TaskCard from './TaskCard'

const statuses = ['NoStatus', 'Planned', 'InProgress', 'InReview', 'Done']

const STATUS_MAP = {
  Planned: TaskStatus.Planned,
  NoStatus: TaskStatus.NoStatus,
  InProgress: TaskStatus.InProgress,
  InReview: TaskStatus.InReview,
  Done: TaskStatus.Done,
}

const PRIORITY_ORDER = {
  [TaskPriority.Urgent]: 0,
  [TaskPriority.High]: 1,
  [TaskPriority.Medium]: 2,
  [TaskPriority.Low]: 3,
  [TaskPriority.NoPriority]: 4,
}

const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const priorityA = PRIORITY_ORDER[a.priority] ?? PRIORITY_ORDER[TaskPriority.NoPriority]
    const priorityB = PRIORITY_ORDER[b.priority] ?? PRIORITY_ORDER[TaskPriority.NoPriority]
    return priorityA - priorityB
  })
}

interface SwimLaneRowProps {
  swimLane: SwimLane
  tasks: Task[]
  onToggleCheck: (taskId: string) => void
  activeId: string | null
  activeContainer: string | null
  overContainer: string | null
  lastOverId: string | null
  onChooseTask: (task: Task) => void
  collapsedColumns: Record<string, boolean>
  isCollapsed: boolean
  onToggleCollapse: () => void
  activeTask: Task | null
}

function SwimLaneHeader({
  swimLane,
  isCollapsed,
  onToggleCollapse,
}: {
  swimLane: SwimLane
  isCollapsed: boolean
  onToggleCollapse: () => void
}) {
  return (
    <div className='flex-shrink-0 overflow-hidden w-[200px] p-4 border-r border-gray-200'>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-gray-800'>{swimLane.title}</div>
        <button
          onClick={onToggleCollapse}
          className='ml-2 text-gray-500 hover:text-gray-700'
          title={isCollapsed ? 'Expand row' : 'Collapse row'}
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
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
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
                d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

function TaskDropzone({ id, isOver }: { id: string; isOver: boolean }) {
  return (
    <div
      id={id}
      className={clsx(
        'relative h-2 w-full my-1 rounded border-2 border-dashed transition-colors flex items-center justify-center',
        isOver ? 'border-purple-500 bg-purple-50' : 'border-transparent',
      )}
      style={{ cursor: 'copy' }}
    >
      {isOver && (
        <div className='w-full h-full flex items-center justify-center text-purple-500 font-medium'>
          Drop here
        </div>
      )}
    </div>
  )
}

function KanbanColumn({
  status,
  swimLaneId,
  tasks,
  visibleTasks,
  showReadMore,
  onReadMore,
  isCollapsed,
  isColumnCollapsed,
  isActive,
  activeId,
  overId,
  onToggleCheck,
  onChooseTask,
}: {
  status: string
  swimLaneId: string
  tasks: Task[]
  visibleTasks: Task[]
  showReadMore: boolean
  onReadMore: () => void
  isCollapsed: boolean
  isColumnCollapsed: boolean
  isActive: boolean
  activeId: string | null
  overId: string | null
  onToggleCheck: (taskId: string) => void
  onChooseTask: (task: Task) => void
}) {
  const columnId = `${swimLaneId}-${status}`
  const { setNodeRef } = useDroppable({ id: columnId })

  const columnClass = clsx(
    isColumnCollapsed ? 'w-[150px]' : 'flex-1 min-w-[180px]',
    'transition-all duration-300',
  )

  if (isCollapsed || isColumnCollapsed) {
    return (
      <div className={columnClass} style={{ height: '100%' }}>
        <div
          className={clsx(
            'h-full flex flex-col items-center justify-center',
            isActive && 'bg-purple-50',
          )}
        >
          {tasks.length > 0 ? (
            <div className='text-xs text-center'>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </div>
          ) : (
            <div className='text-xs text-gray-400 text-center'>Empty</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(columnClass, 'border-r border-gray-200')} style={{ height: '100%' }}>
      <SortableContext
        id={columnId}
        items={visibleTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={clsx('w-full h-full p-2 overflow-y-auto', isActive && 'bg-purple-50')}
          style={{
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable',
            overscrollBehavior: 'contain',
            paddingRight: '4px',
          }}
        >
          <TaskDropzone
            id={`${columnId}-dropzone-0`}
            isOver={overId === `${columnId}-dropzone-0`}
          />
          {visibleTasks.map((task, idx) => (
            <div key={task.id + '-wrapper'} className='relative w-full'>
              <TaskCard
                key={task.id}
                task={task}
                onToggleCheck={onToggleCheck}
                isHidden={task.id === activeId}
                onChooseTask={onChooseTask}
              />
              <TaskDropzone
                id={`${columnId}-dropzone-${idx + 1}`}
                isOver={overId === `${columnId}-dropzone-${idx + 1}`}
              />
            </div>
          ))}
          {showReadMore && (
            <button
              className='w-full mt-2 py-1 px-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm'
              onClick={onReadMore}
            >
              Read more
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function SwimLaneRow({
  swimLane,
  tasks,
  onToggleCheck,
  activeId,
  activeContainer,
  overContainer,
  lastOverId,
  onChooseTask,
  collapsedColumns,
  isCollapsed,
  onToggleCollapse,
}: SwimLaneRowProps) {
  const overId = lastOverId
  const [showAllDone, setShowAllDone] = useState(false)

  return (
    <div
      className={clsx(
        'flex w-full border-b border-gray-200 hover:bg-gray-50 transition-all duration-300',
        isCollapsed ? 'h-[60px]' : 'min-h-[120px]',
      )}
    >
      <SwimLaneHeader
        swimLane={swimLane}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      <div className='flex flex-1 overflow-hidden'>
        {statuses.map((status) => {
          const columnId = `${swimLane.id}-${status}`
          const actualStatus = STATUS_MAP[status as keyof typeof STATUS_MAP]

          const columnTasks = tasks.filter((task) => {
            const taskStatusLower = task.status?.toLowerCase()
            const actualStatusLower = actualStatus?.toLowerCase()
            if (status === 'Done') {
              return task.isDone || taskStatusLower === actualStatusLower
            }
            return taskStatusLower === actualStatusLower && !task.isDone
          })

          const sortedTasks = sortTasksByPriority(columnTasks)

          let visibleTasks = sortedTasks
          let showReadMore = false
          if (status === 'Done' && !showAllDone && sortedTasks.length > 2) {
            visibleTasks = sortedTasks.slice(0, 2)
            showReadMore = true
          }

          const isActive = activeContainer === columnId || overContainer === columnId
          const isColumnCollapsed = collapsedColumns[status]

          return (
            <KanbanColumn
              key={status}
              status={status}
              swimLaneId={swimLane.id}
              tasks={sortedTasks}
              visibleTasks={visibleTasks}
              showReadMore={showReadMore}
              onReadMore={() => setShowAllDone(true)}
              isCollapsed={isCollapsed}
              isColumnCollapsed={isColumnCollapsed}
              isActive={isActive}
              activeId={activeId}
              overId={overId}
              onToggleCheck={onToggleCheck}
              onChooseTask={onChooseTask}
            />
          )
        })}
      </div>
    </div>
  )
}
