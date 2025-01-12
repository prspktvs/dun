import { Menu } from '@mantine/core'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { IProject } from '../../types/Project'
import { useProject } from '../../context/ProjectContext'
import { genId } from '../../utils'
import { getAllUserProject } from '../../services'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { SettingsIcon } from '../icons'

const ProjectSelector = () => {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { id: currentProjectId } = useParams()

  const { project } = useProject()
  const { user } = useAuth()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [user.id])

  const goToProject = (id: string) => navigate(`/${id}`, { replace: true })

  const otherProjectsCount = projects.length > 1 ? projects.length - 1 : 0

  return (
    <Menu
      shadow='md'
      width={isMobile ? '100%' : 280}
      offset={isMobile ? 0 : undefined}
      radius={isMobile ? 0 : 'md'}
      onChange={(opened) => setMenuOpened(opened)}
    >
      <Menu.Target>
        <nav className='relative z-50 flex flex-col justify-between pl-4 pr-[15px] md:px-5 bg-[#edebf3] text-3xl border-borders-purple h-14 md:w-80 border-b-1 hover:cursor-pointer mb-1'>
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
        className={`w-screen max-w-full p-0 m-0 ${isMobile ? 'fixed left-0' : ''} bg-[#f9f9f9]`}
        style={
          isMobile
            ? {
                position: 'fixed',
                left: 0,
                maxHeight: '63vh',
                overflowY: 'auto',
                overflowX: 'hidden',
              }
            : {}
        }
      >
        <Menu.Label className={`text-md font-monospace ${isMobile ? 'hidden' : ''}`}>Your projects</Menu.Label>
        {projects.map((project, idx) => (
          <Menu.Item
            key={'prjx-' + idx}
            className={`flex justify-between items-center py-5 pr-4 text-lg font-medium h-14 pl-7 md:text-md ${
              isMobile ? 'font-monaspace' : ''
            } ${isMobile && project.id === currentProjectId ? 'text-[#8279bd]' : ''}`}
            onClick={() => goToProject(project.id)}
          >
            <span className='flex-1'>{project?.title || 'Empty project'}</span>
            {isMobile && project.id === currentProjectId && (
              <button className=''>
                <SettingsIcon />
              </button>
            )}
          </Menu.Item>
        ))}
        <div className=' h-12 p-2 w-full m-1 bg-[#8279bd] flex justify-center items-center'>
          <Menu.Item
            className='text-sm font-normal text-center text-white'
            onClick={() => (window.location.href = `/${genId()}`)}
          >
            + Create new project
          </Menu.Item>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProjectSelector
