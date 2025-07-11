import { useState, useMemo } from 'react'
import { groupBy, isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import clsx from 'clsx'

import { useProject } from '../../context/ProjectContext'
import TaskPreview from '../Task/TaskPreview'
import LeftPanelButton from '../ui/buttons/LeftPanelButton'
import UserList from '../User/UserList'
import ProjectSelector from '../Project/ProjectSelector'
import FeedbackModal from '../ui/modals/FeedbackModal'

function LeftPanel() {
  const { id: projectId } = useParams()
  const location = useLocation()

  const [isFeedbackOpened, setFeedbackOpened] = useState(false)
  const navigate = useNavigate()

  const { tasks, cards, users, isOnboarding } = useProject()
  const topicCount = cards?.length || 0

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )

  const sortedTasks = useMemo(
    () => tasks.filter((task) => !task.isDone).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    [tasks],
  )

  const groupedTasksById = useMemo(
    () => groupBy(sortedTasks, (task) => task.card_id),
    [sortedTasks],
  )

  const handleFeedback = () => setFeedbackOpened(true)

  return (
    <aside className='flex flex-col items-center h-screen w-80 border-r-1 border-borders-purple'>
      <section className='border-b-1 border-borders-purple h-14'>
        <ProjectSelector />
      </section>

      {!isOnboarding && (
        <section className='flex items-center justify-center w-full h-14 border-b-1 border-borders-purple'>
          <UserList users={users} />
        </section>
      )}
      <nav className='w-full px-5 py-3 pb-1 border-b-1 border-borders-purple'>
        <ul>
          <li className='mb-2'>
            <LeftPanelButton
              isActive={location.pathname.endsWith(projectId)}
              onClick={() => navigate(`/${projectId}`)}
            >
              Topics ・{topicCount}
            </LeftPanelButton>
          </li>
          {!isOnboarding && (
            <>
              <li className='mb-2'>
                <LeftPanelButton
                  isActive={location.pathname.endsWith('my-work')}
                  onClick={() => navigate('my-work')}
                >
                  My work
                </LeftPanelButton>
              </li>
              <li className='mb-2'>
                <LeftPanelButton
                  isActive={location.pathname.endsWith('settings')}
                  onClick={() => navigate('settings')}
                >
                  Project settings
                </LeftPanelButton>
              </li>
            </>
          )}
        </ul>
      </nav>
      <section className='w-full px-5 py-1 border-b-1 border-borders-purple'>
        <LeftPanelButton onClick={handleFeedback}>Share feedback</LeftPanelButton>
        <FeedbackModal opened={isFeedbackOpened} onClose={() => setFeedbackOpened(false)} />
      </section>
      <section className='flex-1 w-full px-6 py-5 overflow-y-scroll'>
        <div
          className={clsx(
            'border border-[#46434e] flex items-center justify-center w-[140px] h-6 px-1.5 rounded mb-5',
            !isEmpty(tasks) ? 'bg-[#DBF7CA]' : 'bg-gray-50',
          )}
        >
          <span className='text-[10px] text-[#46434e] font-normal font-monaspace'>
            {!isEmpty(tasks) ? 'New tasks for you' : 'No new tasks for you'}
          </span>
        </div>

        {Object.keys(groupedTasksById).map((cardId) => (
          <div key={'grouped-tasks-card-id-' + cardId} className='mb-7'>
            <div className='text-[#46434e] text-sm font-bold mb-3'>{cardsTitles[cardId]}</div>
            {groupedTasksById[cardId].map((task) => (
              <div
                key={'grouped-task-' + task.id}
                onClick={() =>
                  task?.cardPath &&
                  navigate(`/${task.cardPath}?taskId=${task.id.split('_').pop()}`, {
                    replace: true,
                  })
                }
                className='rounded-md py-2 px-1.5 hover:cursor-pointer hover:bg-gray-100'
              >
                <TaskPreview task={task} />
              </div>
            ))}
          </div>
        ))}
      </section>
    </aside>
  )
}

export default LeftPanel
