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
  // console.log('. Rendering SwimLaneRowColumn:', columnId, columnTasks.length);
  const taskIds = columnTasks.map((task) => task.id)
  const { setNodeRef } = useDroppable({
    id: columnId,
  })

  // Check if we're currently dragging
  const isDragging = activeId !== null

  // Function to render a column with its tasks and drop indicators
  const renderColumn = (
    columnTasks: Task[],
    columnId: string,
    isActive: boolean,
    setRef: (element: HTMLElement | null) => void,
  ) => {
    // Get the task IDs for this column
    const taskIds = columnTasks.map((task) => task.id)

    // Determine where to show the drop indicator
    let dropIndicatorIndex = -1

    if (isDragging && isActive) {
      if (columnTasks.length === 0) {
        // If the column is empty, show the indicator at index 0
        dropIndicatorIndex = 0
      } else if (lastOverId && !lastOverId.includes('-')) {
        // If we're over a task, find its index
        const overTaskIndex = columnTasks.findIndex((task) => task.id === lastOverId)
        if (overTaskIndex !== -1) {
          // Show the indicator after the task we're over
          dropIndicatorIndex = overTaskIndex + 1
        }
      } else if (lastOverId === columnId) {
        // If we're over the column itself (not a specific task), show at the end
        dropIndicatorIndex = columnTasks.length
      }
    }

    return (
      <div
        ref={setRef}
        className={cn(
          'w-[280px] border-r border-gray-200 p-2 min-h-[120px] transition-colors duration-200',
          isActive ? 'bg-purple-50' : '',
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className='space-y-2'>
            {columnTasks.map((task, index) => (
              <>
                {/* Drop indicator before the first task */}
                {index === 0 && dropIndicatorIndex === 0 && (
                  <div className='h-1 bg-purple-500 rounded-full my-1 mx-2' />
                )}

                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleCheck={onToggleCheck}
                  isHidden={task.id === activeId}
                  onChooseTask={onChooseTask}
                />

                {/* Drop indicator after each task */}
                {dropIndicatorIndex === index + 1 && (
                  <div className='h-1 bg-purple-500 rounded-full my-1 mx-2' />
                )}
              </>
            ))}

            {/* Empty column drop placeholder */}
            {columnTasks.length === 0 && isDragging && isActive && dropIndicatorIndex === 0 && (
              <div className='p-3 border-2 border-dashed border-purple-300 rounded-md bg-purple-50 h-[80px]'>
                <div className='w-full h-full flex items-center justify-center'>
                  <p className='text-purple-500 text-sm font-medium'>Drop here</p>
                </div>
              </div>
            )}

            {/* Drop indicator at the end of the column */}
            {columnTasks.length > 0 && dropIndicatorIndex === columnTasks.length && (
              <div className='h-1 bg-purple-500 rounded-full my-1 mx-2' />
            )}
          </div>
        </SortableContext>
      </div>
    )
  }

  return renderColumn(columnTasks, columnId, isActive, setNodeRef)
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
}: SwimLaneRowProps) {
  // console.log('SwimLaneRow rendered', swimLane.id, tasks);

  return (
    <div className='flex border-b border-gray-200'>
      {/* Swim Lane Title */}
      <div className='flex-shrink-0 w-[200px] p-4 border-r border-gray-200 flex items-center'>
        <span className='font-medium text-gray-700'>{swimLane.title}</span>
      </div>

      {/* Columns */}
      <div className='flex flex-1'>
        {Object.values(TaskStatus).map((status) => (
          <SwimLaneRowColumn
            key={status}
            columnTasks={
              tasks.filter(
                (task) =>
                  (!task.isDone && task.status === status) ||
                  (status === TaskStatus.Done && task.isDone),
              ) as Task[]
            }
            columnId={`${swimLane.id}-${status}`}
            isActive={
              activeContainer === `${swimLane.id}-${status}` ||
              (overContainer === `${swimLane.id}-${status}` && activeId !== null)
            }
            onToggleCheck={onToggleCheck}
            activeId={activeId}
            lastOverId={lastOverId}
            onChooseTask={onChooseTask}
          />
        ))}

        {/* <div className="flex-shrink-0 w-[60px]"></div> */}
      </div>
    </div>
  )
}
