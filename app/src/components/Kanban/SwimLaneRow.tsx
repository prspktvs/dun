import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'

import { type Task, TaskStatus, SwimLane } from './types/task'
import TaskCard from './TaskCard'
import { cn } from './utils'

const StatusMap = {
  Planned: TaskStatus.Planned,
  NoStatus: TaskStatus.NoStatus,
  InProgress: TaskStatus.InProgress,
  InReview: TaskStatus.InReview,
  Done: TaskStatus.Done,
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
  activeTask,
}: SwimLaneRowProps) {
  const overId = lastOverId

  return (
    <div
      className={`flex w-full border-b border-gray-200 hover:bg-gray-50 ${
        isCollapsed ? 'h-[60px]' : 'min-h-[120px]'
      } transition-all duration-300`}
    >
      <div
        className={`flex-shrink-0 overflow-hidden w-[200px] ${isCollapsed ? 'p-4' : 'p-4'} border-r border-gray-200`}
      >
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
        {!isCollapsed && swimLane.description && (
          <div className='text-sm text-gray-500 mt-1 '>{swimLane.description}</div>
        )}
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {(() => {
          const statuses = ['NoStatus', 'Planned', 'InProgress', 'InReview', 'Done']
          const collapsedCount = statuses.filter((status) => collapsedColumns[status]).length
          const allCollapsed = collapsedCount === statuses.length

          return statuses.map((status, index, arr) => {
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
            const isColumnCollapsed = collapsedColumns[status]
            const { setNodeRef } = useDroppable({
              id: columnId,
            })

            let columnClass = ''
            if (isColumnCollapsed) {
              columnClass = allCollapsed ? `flex-1 min-w-0` : `w-[150px]`
            } else {
              columnClass = `flex-1 min-w-[180px]`
            }

            return (
              <div
                key={status}
                className={`${columnClass} ${index < arr.length - 1 ? 'border-r border-gray-200' : ''} transition-all duration-300`}
                style={{ height: '100%' }}
              >
                {isCollapsed ? (
                  <div
                    className={`h-full flex flex-col items-center justify-center ${isActive ? 'bg-purple-50' : ''}`}
                  >
                    {columnTasks.length > 0 ? (
                      <div className='text-xs text-center'>
                        {columnTasks.length} task{columnTasks.length !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className='text-xs text-gray-400 text-center'>Empty</div>
                    )}
                  </div>
                ) : isColumnCollapsed ? (
                  <div
                    className={`h-full flex flex-col items-center justify-center ${isActive ? 'bg-purple-50' : ''}`}
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
                  <SortableContext
                    id={columnId}
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div
                      ref={setNodeRef}
                      className={`w-full h-full p-2 overflow-y-auto ${isActive ? 'bg-purple-50' : ''}`}
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarGutter: 'stable',
                        overscrollBehavior: 'contain',
                        paddingRight: '4px',
                      }}
                    >
                      <div
                        id={`${columnId}-dropzone-0`}
                        className={`relative h-2 w-full my-1 rounded border-2 border-dashed transition-colors flex items-center justify-center
                          ${overId === `${columnId}-dropzone-0` ? 'border-purple-500 bg-purple-50' : 'border-transparent'}
                        `}
                        style={{ cursor: 'copy' }}
                      >
                        {overId === `${columnId}-dropzone-0` && (
                          <div className='w-full h-full flex items-center justify-center text-purple-500 font-medium'>
                            Drop here
                          </div>
                        )}
                      </div>
                      {columnTasks.map((task, idx) => {
                        const dropzoneId = `${columnId}-dropzone-${idx + 1}`
                        const isDropPreview = overId === dropzoneId && activeId

                        return (
                          <div key={task.id + '-wrapper'} className='relative w-full'>
                            <TaskCard
                              key={task.id}
                              task={task}
                              onToggleCheck={onToggleCheck}
                              isHidden={task.id === activeId}
                              onChooseTask={onChooseTask}
                            />

                            <div
                              id={dropzoneId}
                              className={`relative h-2 w-full my-1 rounded border-2 border-dashed transition-colors flex items-center justify-center
                                ${overId === dropzoneId ? 'border-purple-500 bg-purple-50' : 'border-transparent'}
                              `}
                              style={{ cursor: 'copy' }}
                            >
                              {overId === dropzoneId && (
                                <div className='w-full h-full flex items-center justify-center text-purple-500 font-medium'>
                                  Drop here
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      {/* {columnTasks.length === 0 && (
                        <div
                          className={`p-3 border-2 border-dashed ${
                            isActive ? 'border-purple-500' : 'border-purple-300'
                          } rounded-md bg-purple-50 h-[80px] flex items-center justify-center`}
                        >
                          {isActive ? 'Drop here' : 'No tasks'}
                        </div>
                      )} */}
                    </div>
                  </SortableContext>
                )}
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}
