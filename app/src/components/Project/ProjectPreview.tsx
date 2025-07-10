import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isEmpty } from 'lodash'

import UserList from '../User/UserList'
import { useAuth } from '../../context/AuthContext'
import { getAllUserProject } from '../../services'
import { IProject } from '../../types/Project'
import { IUser } from '../../types/User'
import { getRandomProjectRoute } from '../../utils'
import { Loader } from '../ui/Loader'
import { ONBOARDING_ID } from '../../constants/routes.constants'
import { getProject } from '../../services/project.service'

export default function ProjectPreview({ project }: { project: IProject }) {
  const navigate = useNavigate()
  const isOnboarding = project.id === ONBOARDING_ID

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

      {!isOnboarding && <UserList users={project.users as IUser[]} />}
    </article>
  )
}

export function ProjectsList({ search }: { search: string }) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<IProject[]>([])
  const [isLoading, setLoading] = useState(true)
  const [onboardingProject, setOnboardingProject] = useState<IProject | null>(null)
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])

  useEffect(() => {
    if (!user) return
    getAllUserProject(user.id).then((data) => {
      setProjects(data as IProject[])
      setLoading(false)
    })
    getProject(ONBOARDING_ID).then((project) => {
      if (project) {
        setOnboardingProject(project as IProject)
        setLoading(false)
      }
    })
  }, [user?.id])

  useEffect(() => {
    const foundProjects = projects.filter(({ title, id }) =>
      title?.toLowerCase()?.includes(search.toLowerCase()),
    )
    setFilteredProjects(foundProjects)
  }, [search, projects])

  const hasRegularProjects = !isEmpty(filteredProjects)
  const showSetupMessage = !hasRegularProjects

  return (
    <ul className='h-full divide-y-[1px] divide-borders-purple'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {hasRegularProjects &&
            filteredProjects.map((project) => (
              <li key={'dashboard-project-' + project.id}>
                <ProjectPreview project={project} />
              </li>
            ))}

          {onboardingProject && (
            <li key={'dashboard-project-' + onboardingProject.id}>
              <ProjectPreview project={onboardingProject} />
            </li>
          )}

          {showSetupMessage && (
            <li>
              <div className='flex h-full w-full px-10 py-8 justify-center items-center'>
                <span className='font-monaspace text-inactiveText'>
                  You haven't set up your work area yet. To start,{' '}
                  <a href={getRandomProjectRoute()} className='font-bold text-btnBg no-underline'>
                    create new project workspace
                  </a>
                </span>
              </div>
            </li>
          )}
        </>
      )}
    </ul>
  )
}
