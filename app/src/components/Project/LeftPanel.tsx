import { useState, useEffect, useMemo, ReactNode } from 'react'
import { groupBy, isEmpty } from 'lodash'
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
import { SearchIcon, RingIcon } from '../icons'
import ButtonDun from '../ui/buttons/ButtonDun'

interface ButtonDunProps {
  children?: ReactNode
  onClick?: () => void
  className?: string
}

function LeftPanel() {
  const { id: projectId } = useParams()
  const location = useLocation()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [isSettingsOpened, setSettingsOpened] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  const { search, setSearch } = useProject()
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
  const groupedTasksById = useMemo(() => groupBy(tasks, (task) => task.card_id), [tasks])

  const { user } = useAuth()

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id: string) => navigate(`/${id}`, { replace: true })

  const otherProjectsCount = projects.length > 1 ? projects.length - 1 : 0

  const onCreateNewCard = () => {
    console.log('Creating new card')
  }

  return (
    <aside className='flex flex-col md:gap-1 hd:-screen mitems-center md:w-80 md:border-r-1 border-borders-purple'>
      <section>
        <Menu
          shadow='md'
          width={280}
          offset={0}
          radius='md'
          onChange={(opened) => setMenuOpened(opened)}
        >
          <Menu.Target>
            <nav className='flex flex-col justify-between pl-4 pr-[15px] text-3xl h-14 w-full md:w-80 border-b-1 border-borders-purple hover:cursor-pointer hover:bg-gray-100 bg-[#edebf3] md:bg-transparent'>
              {' '}
              {/* Overproject section */}
              <div className='flex items-end gap-1.5 text-xs h-12 text-neutral-400 leading-tight'>
                <span className='flex justify-end items-end text-[#969696] text-[10px] font-normal font-monaspace'>
                  and
                  <span className='ml-1 mr-1 font-bold' id='project-count'>
                    {otherProjectsCount}
                  </span>
                  other projects
                </span>
              </div>
              {/* Project title section */}
              <div className='flex items-center w-full gap-2 md:gap-4 md:justify-between'>
                <span className='text-[#46434e] text-lg font-medium font-argon'>
                  {project?.title || 'Empty project'}
                </span>
                {isMenuOpened ? (
                  <i className='text-2xl ri-arrow-down-s-line' />
                ) : (
                  <i className='text-2xl ri-arrow-right-s-line' />
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
            <div className='border-t-[2px] pt-1  md:mt-1'>
              <Menu.Item
                className='text-gray-500 text-md font-rubik'
                onClick={() => (window.location.href = `/${genId()}`)}
              >
                Create new project
              </Menu.Item>
            </div>
          </Menu.Dropdown>
        </Menu>
      </section>
      <div className='relative flex items-center gap-2 md:gap-3 md:py-3 md:px-6 border-b-1 md:hidden'>
        <div class='h-10 px-4 py-3 bg-[#f9f9f9] justify-start items-center gap-2 inline-flex'>
          <SearchIcon className='absolute left-0 w-5 h-5 ' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Find it all'
            className='text-sm font-normal font-agron'
          />
        </div>
        <div className='inline-flex items-center justify-center flex-shrink-0 h-full border-l border-borders-purple'>
          <ButtonDun onClick={onCreateNewCard} className='w-full h-full'>
            <span className='text-xl font-thin'>+</span>Topic
          </ButtonDun>
        </div>
      </div>

      <section className='items-center justify-center hidden w-full md:flex h-14 border-b-1 border-borders-purple'>
        {' '}
      </section>
      <nav className='hidden w-full px-5 pb-1 border-b-1 border-borders-purple md:flex '>
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
      <section className='hidden w-full px-6 py-5 overflow-y-scroll fhidden md:flex lex-1 '>
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
