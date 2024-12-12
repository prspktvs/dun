import { Menu } from '@mantine/core'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { IProject } from '../../types/Project'
import { useProject } from '../../context/ProjectContext'
import { genId } from '../../utils'
import { getAllUserProject } from '../../services'
import { useAuth } from '../../context/AuthContext'

const ProjectSelector = () => {
  const navigate = useNavigate()

  const { project } = useProject()
  const { user } = useAuth()
  const [isMenuOpened, setMenuOpened] = useState(false)
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    getAllUserProject(user.id).then((data) => setProjects(data))
  }, [])

  const goToProject = (id: string) => navigate(`/${id}`, { replace: true })

  const otherProjectsCount = projects.length > 1 ? projects.length - 1 : 0

  return (
    <Menu
      shadow='md'
      width={280}
      offset={0}
      radius='md'
      onChange={(opened) => setMenuOpened(opened)}
    >
      <Menu.Target>
        <nav className='flex flex-col justify-between px-5 text-3xl border-borders-purple h-14 w-80 border-b-1 hover:cursor-pointer hover:bg-gray-100'>
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
          <div className='flex items-center justify-between w-full gap-4'>
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
        <div className='border-t-[2px] pt-1 mt-1'>
          <Menu.Item
            className='text-gray-500 text-md font-rubik'
            onClick={() => (window.location.href = `/${genId()}`)}
          >
            Create new project
          </Menu.Item>
        </div>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProjectSelector
