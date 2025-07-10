import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { type Task, TaskPriority, TaskStatus } from './types/task'
import { cn } from './utils'
import { useProject } from '../../context/ProjectContext'

const Checkbox = ({
  checked,
  onClick,
  onCheckedChange,
  id,
  className,
}: {
  checked: boolean | undefined
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void
  onCheckedChange: () => void
  id: string
  className?: string
}) => (
  <input
    type='checkbox'
    id={id}
    checked={checked}
    onClick={onClick}
    onChange={onCheckedChange}
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

  const style = isDragOverlay
    ? {
        opacity: isInvalidDrop ? 0.4 : 1,
        cursor: isInvalidDrop ? 'not-allowed' : 'grab',
        border: isInvalidDrop ? '2px solid #ff0000' : undefined,
      }
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }

  const priorityStyles = {
    [TaskPriority.Low]: 'bg-blue-50 border-blue-200 shadow-blue-100',
    [TaskPriority.Medium]: 'bg-yellow-50 border-yellow-200 shadow-yellow-100',
    [TaskPriority.High]: 'bg-red-50 border-red-200 shadow-red-100',
    [TaskPriority.Urgent]: 'bg-rose-50 border-rose-300 shadow-rose-100',
  }
  const cardPriority = priorityStyles[task.priority] || 'bg-white border-gray-200 shadow-gray-100'

  const authorName = usersMap?.[task?.author]?.name || task.author

  if (isHidden) {
    return null
  }

  return (
    <div
      {...(isDragOverlay ? {} : { ...attributes, ...listeners, ref: setNodeRef })}
      style={style}
      className={cn(
        'p-4 rounded-xl border shadow-sm transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5 hover:bg-opacity-90',
        !isDragOverlay && 'cursor-grab active:cursor-grabbing',
        isDragOverlay && 'shadow-md',
        cardPriority,
        isDragging && 'opacity-60',
      )}
      onDoubleClick={() => {
        if (onChooseTask) {
          onChooseTask(task)
        }
      }}
    >
      <div className='flex items-start gap-3'>
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isDone}
          onCheckedChange={() => onToggleCheck(task.id)}
          className='mt-1'
          onClick={(e) => e.stopPropagation()}
        />
        <div className='flex-1'>
          <p
            className={cn(
              'text-gray-900 mb-1 mt-0 text-base font-medium',
              task.isDone ? 'line-through text-gray-400' : '',
            )}
          >
            {task.text}
          </p>
          <div className='flex flex-col gap-1 items-start'>
            <div className='flex gap-2 ml-1'>
              {task.users?.map?.((assignee, index) => (
                <span
                  key={index}
                  className='text-xs text-gray-600 font-bold bg-gray-200 rounded px-2 py-0.5'
                >
                  @{usersMap?.[assignee]?.name}
                </span>
              ))}
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-1'>
              {task.priority === TaskPriority.Urgent && (
                <span className='text-xs font-semibold text-rose-600 bg-rose-100 rounded px-2 py-0.5 ml-1'>
                  Urgent
                </span>
              )}
              {task.priority === TaskPriority.High && (
                <span className='text-xs font-semibold text-red-600 bg-red-100 rounded px-2 py-0.5 ml-1'>
                  High
                </span>
              )}
              {task.priority === TaskPriority.Medium && (
                <span className='text-xs font-semibold text-yellow-700 bg-yellow-100 rounded px-2 py-0.5 ml-1'>
                  Medium
                </span>
              )}
              {task.priority === TaskPriority.Low && (
                <span className='text-xs font-semibold text-blue-700 bg-blue-100 rounded px-2 py-0.5 ml-1'>
                  Low
                </span>
              )}
              {task.author ? (
                <span className='text-xs text-gray-400 ml-2'>by {authorName}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
