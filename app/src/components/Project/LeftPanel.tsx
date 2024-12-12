import { useState, useMemo } from 'react'
import { groupBy, isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { useProject } from '../../context/ProjectContext'
import TaskPreview from '../Task/TaskPreview'
import LeftPanelButton from '../ui/buttons/LeftPanelButton'
import ProjectSettingsModal from './ProjectSettingsModal'
import UserList from '../User/UserList'
import ProjectSelector from '../Project/ProjectSelector'

function LeftPanel() {
  const { id: projectId } = useParams()
  const location = useLocation()
  const [isSettingsOpened, setSettingsOpened] = useState(false)
  const navigate = useNavigate()

  const { tasks, cards, users } = useProject()
  const topicCount = cards?.length || 0

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )
  const groupedTasksById = useMemo(() => groupBy(tasks, (task) => task.card_id), [tasks])

  return (
    <aside className='flex flex-col items-center h-screen gap-1 w-80 border-r-1 border-borders-purple'>
      <section>
        <ProjectSelector />
      </section>
      <section className='flex items-center justify-center w-full h-14 border-b-1 border-borders-purple'>
        <UserList users={users} />
      </section>
      <nav className='w-full px-5 pb-1 border-b-1 border-borders-purple'>
        <ul>
          <li className='mb-2'>
            <LeftPanelButton
              isActive={location.pathname.endsWith('my-work') && !isSettingsOpened}
              onClick={() => navigate('my-work')}
            >
              My work
            </LeftPanelButton>
          </li>
          <li className='mb-2'>
            <LeftPanelButton
              isActive={location.pathname.endsWith(projectId) && !isSettingsOpened}
              onClick={() => navigate(`/${projectId}`)}
            >
              Topics ・{topicCount}
            </LeftPanelButton>
          </li>
          <li className='mb-2'>
            <LeftPanelButton isActive={isSettingsOpened} onClick={() => setSettingsOpened(true)}>
              Project settings
            </LeftPanelButton>
          </li>
        </ul>
      </nav>
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
                onClick={() => task?.cardPath && navigate(`/${task.cardPath}`, { replace: true })}
                className='rounded-md py-2 px-1.5 hover:cursor-pointer hover:bg-gray-100'
              >
                <TaskPreview task={task} />
              </div>
            ))}
          </div>
        ))}

        <div className='pl-1 text-sm font-semibold text-btnBg font-monaspace'>+12</div>
      </section>
      <ProjectSettingsModal opened={isSettingsOpened} onClose={() => setSettingsOpened(false)} />
    </aside>
  )
}

export default LeftPanel
