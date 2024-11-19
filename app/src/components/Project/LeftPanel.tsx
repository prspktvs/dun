import { useState, useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Menu } from '@mantine/core'
import clsx from 'clsx'

import { useAuth } from '../../context/AuthContext'
import { getAllUserProject } from '../../services'
import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import TaskPreview from '../Task/TaskPreview'
import ProjectUsers from '../User/ProjectUsers'
import LeftPanelButton from '../ui/buttons/LeftPanelButton'
import ProjectSettingsModal from './ProjectSettingsModal'

function LeftPanel() {
  const { id: projectId } = useParams()
  const location = useLocation()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [isSettingsOpened, setSettingsOpened] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const { tasks, cards, project } = useProject()
  const topicCount = cards?.length || 0

  const cardsTitles = useMemo(
    () =>
      cards.reduce((acc, card) => {
        acc[card.id] = card.title
        return acc
      }, {}),
    [cards],
  )
  const groupedTasksById = useMemo(() => Object.groupBy(tasks, (task) => task.card_id), [tasks])

  const { user } = useAuth()

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id: string) => navigate(`/${id}`, { replace: true })

  const otherProjectsCount = projects.length > 1 ? projects.length - 1 : 0

  return (
    <aside className='flex flex-col items-center gap-1 w-80 border-r-1 border-border-color h-screen'>
      <section>
        <Menu
          shadow='md'
          width={280}
          offset={0}
          radius='md'
          onChange={(opened) => setMenuOpened(opened)}
        >
          <Menu.Target>
            <nav className='border-border-color h-14 px-5 w-80 border-b-1 text-3xl flex flex-col justify-between hover:cursor-pointer hover:bg-gray-100'>
              {/* Overproject section */}
              <div className='flex items-end gap-1.5 text-xs h-12 text-neutral-400 leading-tight'>
                <span className='flex justify-end items-end text-[#969696] text-[10px] font-normal font-monaspace'>
                  and
                  <span className='font-bold mr-1 ml-1' id='project-count'>
                    {otherProjectsCount}
                  </span>
                  other projects
                </span>
              </div>

              {/* Project title section */}
              <div className='flex justify-between items-center w-full gap-4'>
                <span className='text-[#46434e] text-lg font-medium font-argon'>
                  {project?.title || 'Empty project'}
                </span>
                {isMenuOpened ? (
                  <i className='ri-arrow-down-s-line text-2xl' />
                ) : (
                  <i className='ri-arrow-right-s-line text-2xl' />
                )}
              </div>
            </nav>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label className='text-md font-monaspace'>Your projects</Menu.Label>
            {projects.map((project, idx) => (
              <Menu.Item
                key={'prjx-' + idx}
                className='text-md font-rubik'
                onClick={() => goToProject(project.id)}
              >
                {project?.title || 'Empty project'}
              </Menu.Item>
            ))}
            <div className='border-t-[2px] pt-1 mt-1'>
              <Menu.Item
                className='text-md font-rubik text-gray-500'
                onClick={() => (window.location.href = `/${genId()}`)}
              >
                Create new project
              </Menu.Item>
            </div>
          </Menu.Dropdown>
        </Menu>
      </section>
      <section className='h-14 w-full flex items-center justify-center border-b-1 border-border-color'>
        <ProjectUsers />
      </section>
      <nav className='w-full border-b-1 border-border-color px-5 pb-1'>
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

        <div className='text-[#8279bd] text-sm font-semibold font-monaspace pl-1'>+12</div>
      </section>
      <ProjectSettingsModal opened={isSettingsOpened} onClose={() => setSettingsOpened(false)} />
    </aside>
  )
}

export default LeftPanel
