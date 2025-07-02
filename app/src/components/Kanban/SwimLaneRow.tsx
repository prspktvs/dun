import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'

import { type Task, TaskStatus, SwimLane } from './types/task'
import TaskCard from './TaskCard'
import { cn } from './utils'

interface SwimLaneRowProps {
  swimLane: SwimLane
  tasks: Task[]
  onToggleCheck: (taskId: string) => void
  activeId: string | null
  activeContainer: string | null
  overContainer: string | null
  lastOverId: string | null
  onChooseTask?: (task: Task) => void
  collapsedColumns: Record<string, boolean>
}

function SwimLaneRowColumn({
  columnTasks,
  columnId,
  isActive,
  onToggleCheck,
  activeId,
  lastOverId,
  onChooseTask,
}: {
  columnTasks: Task[]
  columnId: string
  isActive: boolean
  onToggleCheck: (taskId: string) => void
  activeId: string | null
  lastOverId: string | null
  onChooseTask?: (task: Task) => void
}) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  })

  const sortedTasks = [...columnTasks].sort((a, b) => (a.position || 0) - (b.position || 0))

  const getDropIndicator = (taskId: string) => {
    if (!activeId || activeId === taskId) return false
    return lastOverId === taskId
  }

  return (
    <div
      ref={setNodeRef}
      className={`w-[280px] border-r border-gray-200 p-2 min-h-[120px] ${
        isActive ? 'bg-purple-50' : ''
      }`}
    >
      {sortedTasks.map((task) => (
        <div key={task.id}>
          {getDropIndicator(task.id) && (
            <div className='h-1 bg-purple-500 rounded-full my-1 mx-2' />
          )}
          <TaskCard
            task={task}
            onToggleCheck={onToggleCheck}
            isHidden={task.id === activeId}
            onChooseTask={onChooseTask}
          />
        </div>
      ))}
      {columnTasks.length === 0 && isActive && (
        <div className='p-3 border-2 border-dashed border-purple-300 rounded-md bg-purple-50 h-[80px] flex items-center justify-center'>
          Drop here
        </div>
      )}
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
}: SwimLaneRowProps) {
  return (
    <div className='flex w-full border-b border-gray-200 hover:bg-gray-50'>
      <div className='flex-shrink-0 w-[200px] p-4 border-r border-gray-200'>
        <div className='font-medium text-gray-800'>{swimLane.title}</div>
        {swimLane.description && (
          <div className='text-sm text-gray-500 mt-1'>{swimLane.description}</div>
        )}
      </div>

      <div className='flex flex-1'>
        {['NoStatus', 'Planned', 'InProgress', 'InReview', 'Done'].map((status) => {
          const columnId = `${swimLane.id}-${status}`

          const statusMap = {
            Planned: TaskStatus.Planned,
            NoStatus: TaskStatus.NoStatus,
            InProgress: TaskStatus.InProgress,
            InReview: TaskStatus.InReview,
            Done: TaskStatus.Done,
          }

          const actualStatus = statusMap[status]

          const columnTasks = tasks.filter((task) => {
            const taskStatusLower = task.status?.toLowerCase()
            const actualStatusLower = actualStatus?.toLowerCase()

            if (status === 'Done') {
              return task.isDone || taskStatusLower === actualStatusLower
            }
            return taskStatusLower === actualStatusLower && !task.isDone
          })

          const isActive = activeContainer === columnId || overContainer === columnId
          const isCollapsed = collapsedColumns[status]
          const { setNodeRef } = useDroppable({
            id: columnId,
          })

          return (
            <div
              key={status}
              className={`${
                isCollapsed ? 'w-[60px]' : 'flex-1 min-w-[180px]'
              } border-r border-gray-200 transition-all duration-300`}
            >
              {isCollapsed ? (
                <div
                  className={`h-full py-2 px-1 flex flex-col items-center ${isActive ? 'bg-purple-50' : ''}`}
                >
                  {columnTasks.length > 0 ? (
                    <div className='text-xs text-center'>
                      {columnTasks.length} task{columnTasks.length !== 1 ? 's' : ''}
                    </div>
                  ) : (
                    <div className='text-xs text-gray-400 text-center'>Empty</div>
                  )}
                </div>
              ) : (
                <div
                  ref={setNodeRef}
                  className={`w-full p-2 min-h-[120px] ${isActive ? 'bg-purple-50' : ''}`}
                >
                  {columnTasks.map((task) => (
                    <div key={task.id}>
                      {lastOverId === task.id && activeId !== task.id && (
                        <div className='h-1 bg-purple-500 rounded-full my-1 mx-2' />
                      )}
                      <TaskCard
                        task={task}
                        onToggleCheck={onToggleCheck}
                        isHidden={task.id === activeId}
                        onChooseTask={onChooseTask}
                      />
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div
                      className={`p-3 border-2 border-dashed ${isActive ? 'border-purple-500' : 'border-purple-300'} rounded-md bg-purple-50 h-[80px] flex items-center justify-center`}
                    >
                      {isActive ? 'Drop here' : 'No tasks'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
