import { type Task, TaskPriority, TaskStatus } from './types/task';
import { cn } from './utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Checkbox = ({
  checked,
  onClick,
  onCheckedChange,
  id,
  className
}: {
  checked: boolean | undefined;
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  onCheckedChange: () => void;
  id: string;
  className?: string;
}) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onClick={onClick}
    onChange={onCheckedChange}
    className={cn(
      "cursor-pointer rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-2",
      className
    )}
  />
);

interface TaskCardProps {
  task: Task;
  onToggleCheck: (taskId: string) => void;
  isDragOverlay?: boolean;
  isHidden?: boolean;
  onChooseTask?: (task: Task) => void;
}

export default function TaskCard({
  task,
  onToggleCheck,
  isDragOverlay = false,
  isHidden = false,
  onChooseTask
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  // Style for the card
  const style = isDragOverlay
    ? undefined // No special styling for overlay - let DragOverlay handle it
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        boxShadow: '10px 10px var(--tw-shadow-color)'
      };

  const getShadowColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.Low:
        return 'shadow-blue-200';
      case TaskPriority.Medium:
        return 'shadow-yellow-500';
      case TaskPriority.High:
        return 'shadow-red-200';
      case TaskPriority.Urgent:
        return 'shadow-rose-200';
      default:
        return 'shadow-gray-200';
    }
  };

  const getCardBg = (status: TaskStatus) => {
    if (status === TaskStatus.Done) {
      return 'bg-white';
    }

    switch (task.priority) {
      case TaskPriority.Low:
        return 'bg-blue-50';
      case TaskPriority.Medium:
        return 'bg-yellow-50';
      case TaskPriority.High:
        return 'bg-red-50';
      case TaskPriority.Urgent:
        return 'bg-rose-50';
      default:
        return 'bg-white';
    }
  };

  // If this is the drag overlay, we don't need the sortable props
  const cardProps = isDragOverlay
    ? {}
    : {
        ...attributes,
        ...listeners,
        ref: setNodeRef,
      };

  if (isHidden) {
    return null; // Don't render anything if hidden
  }

  return (
    <div
      {...cardProps}
      style={style}
      className={cn(
        "p-3 border border-gray-200",
        !isDragOverlay && "cursor-grab active:cursor-grabbing",
        isDragOverlay && "shadow-md",
        getCardBg(task.status),
        getShadowColor(task.priority)
      )}
      onDoubleClick={() => {
        if (onChooseTask) {
          onChooseTask(task);
        }
      }}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isDone}
          onCheckedChange={() => onToggleCheck(task.id)}
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1">
          <p className={cn(
            "text-gray-800 mb-1 mt-0",
            task.isDone ? "line-through text-gray-500" : ""
          )}>
            {task.text}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {task.users?.map?.((assignee, index) => (
              <span key={index} className="text-sm text-gray-600">
                {assignee}
              </span>
            ))}

            {task.priority === TaskPriority.Urgent && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-rose-500">
                  Urgent
                </span>
                {/* {task.daysLeft && (
                  <span className="text-xs text-rose-500">
                    {task.daysLeft} day{task.daysLeft !== 1 ? 's' : ''} left •
                  </span>
                )} */}
                {task.author && (
                  <span className="text-xs text-gray-500">
                    Created by {task.author}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
