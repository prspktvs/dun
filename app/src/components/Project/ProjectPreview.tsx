import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import UserList from '../User/UserList'
import { useAuth } from '../../context/AuthContext'
import { getAllUserProject } from '../../services'
import { IProject } from '../../types/Project'
import { IUser } from '../../types/User'

export default function ProjectPreview({ project }: { project: IProject }) {
  const navigate = useNavigate()

  const goToProject = () => navigate(`/${project.id}`)
  return (
    <article
      className='flex justify-between items-center px-10 py-5 hover:cursor-pointer'
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

export function ProjectsList() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<IProject[]>([])

  useEffect(() => {
    if (!user) return
    getAllUserProject(user.id).then((data) => setProjects(data as IProject[]))
  }, [user?.id])

  return (
    <ul className='divide-y-[1px] divide-borders-purple'>
      {projects.map((project) => (
        <li key={'dashboard-project-' + project.id}>
          <ProjectPreview project={project} />
        </li>
      ))}
    </ul>
  )
}
