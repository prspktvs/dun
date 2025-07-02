import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

import UserList from '../User/UserList'
import { useAuth } from '../../context/AuthContext'
import { getAllUserProject } from '../../services'
import { IProject } from '../../types/Project'
import { IUser } from '../../types/User'
import { getRandomProjectRoute } from '../../utils'

export default function ProjectPreview({ project }: { project: IProject }) {
  const navigate = useNavigate()

  const goToProject = () => navigate(`/${project.id}`)
  return (
    <article
      className='flex justify-between items-center px-10 py-5 hover:cursor-pointer hover:bg-hoverBox'
      onClick={goToProject}
    >
      <div>
        <h1 className='text-xl p-0 m-0'>{project.title}</h1>
        <p className='text-sm p-0 m-0'>{project.description}</p>
      </div>

      <UserList users={project.users as IUser[]} />
    </article>
  )
}

export function ProjectsList({ search }: { search: string }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<IProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])

  useEffect(() => {
    if (!user) return
    getAllUserProject(user.id).then((data) => setProjects(data as IProject[]))
  }, [user?.id])

  useEffect(() => {
    const foundProjects = projects.filter(({ title }) =>
      title?.toLowerCase()?.includes(search.toLowerCase()),
    )
    setFilteredProjects(foundProjects)
  }, [search, projects])

  return (
    <ul className='h-full divide-y-[1px] divide-borders-purple'>
      {!isEmpty(filteredProjects) ? (
        filteredProjects.map((project) => (
          <li key={'dashboard-project-' + project.id}>
            <ProjectPreview project={project} />
          </li>
        ))
      ) : (
        <div className='flex h-full w-full px-10 justify-center items-center'>
          <span className='font-monaspace text-inactiveText'>
            You haven't set up your work area yet. To start,{' '}
            <a href={getRandomProjectRoute()} className='font-bold text-btnBg no-underline'>
              create new project workspace
            </a>
          </span>
        </div>
      )}
    </ul>
  )
}
