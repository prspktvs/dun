import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { type Task, TaskPriority, TaskStatus } from './types/task'
import { cn } from './utils'
import { useProject } from '../../context/ProjectContext'

const Checkbox = ({
  checked,
  onClick,
  onCheckedChange,
  onMouseUp,
  onPointerDown,
  id,
  className,
}: {
  checked: boolean | undefined
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void
  onCheckedChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void
  onPointerDown?: (e: React.PointerEvent<HTMLInputElement>) => void
  id: string
  className?: string
}) => (
  <input
    type='checkbox'
    id={id}
    checked={checked}
    onClick={onClick}
    onChange={onCheckedChange}
    onMouseUp={onMouseUp}
    onPointerDown={onPointerDown}
    className={cn(
      'cursor-pointer rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-2',
      className,
    )}
  />
)

interface TaskCardProps {
  task: Task
  onToggleCheck: (taskId: string) => void
  isDragOverlay?: boolean
  isHidden?: boolean
  isInvalidDrop?: boolean
  onChooseTask?: (task: Task) => void
}

export default function TaskCard({
  task,
  onToggleCheck,
  isDragOverlay = false,
  isHidden = false,
  isInvalidDrop = false,
  onChooseTask,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })

  const { usersMap } = useProject()

  const priorityStyles = {
    [TaskPriority.Low]: 'bg-blue-50',
    [TaskPriority.Medium]: 'bg-yellow-50',
    [TaskPriority.High]: 'bg-orange-50',
    [TaskPriority.Urgent]: 'bg-red-50',
  }

  const cardPriority = priorityStyles[task.priority] || 'bg-white'

  const getShadowColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Urgent:
        return '#FF7474'
      case TaskPriority.High:
        return '#FFB774'
      case TaskPriority.Medium:
        return '#F5CC63'
      case TaskPriority.Low:
        return '#00A3FF'
      default:
        return 'rgba(0, 0, 0, 0.2)'
    }
  }

  const shadowColor = getShadowColor(task.priority)

  const style = isDragOverlay
    ? {
        opacity: isInvalidDrop ? 0.4 : 1,
        cursor: isInvalidDrop ? 'not-allowed' : 'grab',
        border: isInvalidDrop ? '2px solid #ff0000' : undefined,
        boxShadow: `4px 4px 0px ${shadowColor}`,
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        boxShadow: `6px 6px 0px ${shadowColor}`,
      }

  const authorName = usersMap?.[task?.author]?.name || task.author

  if (isHidden) {
    return null
  }

  return (
    <div
      {...(isDragOverlay ? {} : { ...attributes, ...listeners, ref: setNodeRef })}
      style={{
        ...style,
        transition: style.transition || 'all 0.2s',
      }}
      className={cn(
        'p-4 border border-[#C1B9CF] transition-all duration-200',
        'hover:-translate-y-0.5 hover:bg-opacity-90',
        !isDragOverlay && 'cursor-pointer active:cursor-grabbing',
        cardPriority,
        isDragging && 'opacity-60',
      )}
      onMouseEnter={(e) => {
        if (!isDragOverlay) {
          e.currentTarget.style.boxShadow = `4px 4px 0px ${shadowColor}`
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragOverlay) {
          e.currentTarget.style.boxShadow = `6px 6px 0px ${shadowColor}`
        }
      }}
      onMouseUp={() => {
        if (onChooseTask && !isDragging) {
          onChooseTask(task)
        }
      }}
    >
      <div className='flex items-start gap-3'>
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isDone}
          onCheckedChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation()
            onToggleCheck(task.id)
          }}
          className='mt-1'
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onPointerDown={(e: React.PointerEvent<HTMLInputElement>) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        />
        <div className='flex-1 overflow-hidden'>
          <p
            className={cn(
              'text-gray-900 mb-1 mt-0 text-base break-words',
              task.isDone ? 'line-through text-gray-400' : '',
            )}
          >
            {task.text}
          </p>

          <div className='flex flex-wrap items-center gap-2 mt-1'>
            {task.author ? (
              <span className='text-xs text-gray-400'>
                Created by <b>{authorName}</b>
              </span>
            ) : null}
            {task.priority === TaskPriority.Urgent && (
              <span className='text-xs font-semibold text-white bg-[#FF7474] rounded px-2 py-0.5'>
                Urgent
              </span>
            )}
            {task.priority === TaskPriority.High && (
              <span className='text-xs font-semibold text-white bg-[#FFB774] rounded px-2 py-0.5'>
                High
              </span>
            )}
            {task.priority === TaskPriority.Medium && (
              <span className='text-xs font-semibold text-black bg-[#F5CC63] rounded px-2 py-0.5'>
                Medium
              </span>
            )}
            {task.priority === TaskPriority.Low && (
              <span className='text-xs font-semibold text-white bg-[#00A3FF] rounded px-2 py-0.5'>
                Low
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
