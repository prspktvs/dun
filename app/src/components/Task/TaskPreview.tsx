import { ITask } from '../../types/Task'

const TaskPreview = ({ task }: { task: ITask }) =>
  task.text ? (
    <div className='flex items-center w-full gap-1 overflow-hidden  whitespace-nowrap'>
      {task.isDone ? (
        <i className='ri-checkbox-line  text-lg' />
      ) : (
        <i className='ri-checkbox-blank-line text-lg' />
      )}
      <span className='text-sm'>{task.text}</span>
    </div>
  ) : null

export default TaskPreview
