import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { ITask, TaskPriority } from '../../types/Task.d.ts'

const TaskPreview = ({ task }: { task: ITask }) => {
  const { isDone, text, author, status, priority } = task
  const { users } = useProject()

  const authorName = users.find((u) => u.id === author)?.name
  return (
    <div>
      <div className='flex items-start w-full gap-1 overflow-hidden whitespace-nowrap'>
        {isDone ? (
          <i className='ri-checkbox-line  text-14' />
        ) : (
          <i className='ri-checkbox-blank-line text-14' />
        )}
        <span className='text-14 font-rubik line-clamp-2 text-wrap'>{text}</span>
      </div>
      <div className='flex gap-3 ml-[18px]'>
        <span className='font-rubik text-14 text-[#969696] font-medium hover:cursor-pointer'>
          {status}
        </span>
        <span
          className={clsx(
            'font-rubik text-14 text-[#969696] font-medium hover:cursor-pointer',
            priority === TaskPriority.Low
              ? 'text-priority-low'
              : priority === TaskPriority.Medium
              ? 'text-priority-medium'
              : priority === TaskPriority.High
              ? 'text-priority-high'
              : 'text-priority-urgent',
          )}
        >
          {priority}
        </span>
      </div>
      {!authorName ? null : (
        <div className='text-12  ml-[18px]'>
          Created by <span>{authorName}</span>
        </div>
      )}
    </div>
  )
}

export default TaskPreview
