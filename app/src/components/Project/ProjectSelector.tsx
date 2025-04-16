import { Menu } from '@mantine/core'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { IProject } from '../../types/Project'
import { useProject } from '../../context/ProjectContext'
import { genId, getRandomProjectRoute } from '../../utils'
import { getAllUserProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { SettingsIcon } from '../icons'
import ButtonDun from '../ui/buttons/ButtonDun'
import { ROUTES } from '../../constants'

const ProjectSelector = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { id: currentProjectId } = useParams()

  const { project } = useProject()
  const { user } = useAuth()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [user?.id, project.title])

  const sortedProjects = useMemo(() => {
    if (!projects.length) return []
    const current = projects.find((p) => p.id === currentProjectId)
    const others = projects.filter((p) => p.id !== currentProjectId)
    return current ? [current, ...others] : projects
  }, [projects, currentProjectId])

  const isCurrentProject = (projectId: string) => projectId === currentProjectId

  const onSettingsClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!onOpenSettings) return
    setMenuOpened(false)
    onOpenSettings()
  }

  const goToProject = (id: string) => navigate(`/${id}`, { replace: true })

  const otherProjectsCount = sortedProjects.length > 1 ? sortedProjects.length - 1 : 0

  return (
    <Menu
      shadow='md'
      width={isMobile ? '100%' : 300}
      offset={isMobile ? 0 : undefined}
      radius={0}
      opened={isMenuOpened}
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <nav className='relative z-50 flex flex-col w-full justify-between pl-4 pr-[15px] md:px-5 text-3xl h-14 md:w-80 hover:cursor-pointer '>
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
              <i className='text-2xl ri-arrow-down-s-line' />
            )}
          </div>
        </nav>
      </Menu.Target>

      <Menu.Dropdown
        className={clsx(
          `w-screen max-w-full p-0 m-0 bg-[#f9f9f9]`,
          isMobile && 'fixed left-0 overflow-y-scroll overflow-x-hidden',
        )}
        style={{ boxShadow: '14px 14px 0px 0px #C1BAD0' }}
      >
        <Menu.Label className={`text-md font-monospace ${isMobile ? 'hidden' : ''}`}>
          Your projects
        </Menu.Label>
        <div className='max-h-[40vh] overflow-y-scroll'>
          {sortedProjects.map((project, idx) => (
            <Menu.Item
              key={'prjx-' + idx}
              classNames={{
                itemLabel: clsx(
                  `flex justify-between items-center py-5 pr-4 text-lg font-medium h-14 pl-7 md:text-md`,
                  isCurrentProject(project.id) && 'bg-btnBg/10',
                ),
              }}
              onClick={() => goToProject(project.id)}
            >
              <span
                className={clsx(
                  'flex-1 font-monaspace font-bold',
                  isCurrentProject(project.id) && 'text-btnBg',
                )}
              >
                {project?.title || 'Empty project'}
              </span>
              {isCurrentProject(project.id) && (
                <button onClick={onSettingsClick}>
                  <SettingsIcon />
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
        <div className='h-14 w-full'>
          <ButtonDun
            onClick={() => navigate(getRandomProjectRoute(), { replace: true })}
            className='w-full h-full'
          >
            + Create new project
          </ButtonDun>
        </div>
        <div className='h-14 w-full'>
          <ButtonDun
            onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
            className='w-full h-full bg-gray-100 border-none text-btnBg hover:bg-gray-100 hover:text-btnBg'
          >
            All projects
          </ButtonDun>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProjectSelector
