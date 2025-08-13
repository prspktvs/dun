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
import { ProjectSearchHit, searchProjectsByTopics } from '../ui/Search'

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
  const [highlightsByProject, setHighlightsByProject] = useState<
    Record<string, { title?: string | null; content?: string | null }>
  >({})

  useEffect(() => {
    const currentUserId = (user as any)?.id || (user as any)?.uid
    if (!currentUserId) return
    getAllUserProject(currentUserId).then((data) => {
      setProjects(data as IProject[])
      setLoading(false)
    })
    getProject(ONBOARDING_ID).then((project) => {
      if (project) {
        setOnboardingProject(project as IProject)
        setLoading(false)
      }
    })
  }, [(user as any)?.id, (user as any)?.uid])

  useEffect(() => {
    let isCancelled = false

    async function run() {
      if (!search) {
        const foundProjects = projects.filter(({ title }) =>
          title?.toLowerCase()?.includes(search.toLowerCase()),
        )
        if (!isCancelled) {
          setFilteredProjects(foundProjects)
          setHighlightsByProject({})
        }
        return
      }

      try {
        const hits: ProjectSearchHit[] = await searchProjectsByTopics(search)
        const ids = hits.map((h) => h.project_id)

        const s = search.toLowerCase()
        const localMatches = projects.filter(
          (p) =>
            (p.title || '').toLowerCase().includes(s) ||
            (p.description || '').toLowerCase().includes(s),
        )

        const unionMap: Record<string, IProject> = {}
        for (const p of projects) {
          if (ids.includes(p.id)) unionMap[p.id] = p
        }
        for (const p of localMatches) {
          unionMap[p.id] = p
        }
        const found = Object.values(unionMap)

        const highlights = hits.reduce(
          (acc, h) => {
            if (h.project_id) acc[h.project_id] = h.highlights || {}
            return acc
          },
          {} as Record<string, { title?: string | null; content?: string | null }>,
        )

        const makeBold = (text: string, q: string) => {
          if (!text) return null
          const idx = text.toLowerCase().indexOf(q.toLowerCase())
          if (idx === -1) return null
          const before = text.slice(0, idx)
          const match = text.slice(idx, idx + q.length)
          const after = text.slice(idx + q.length)
          return `${before}<span class="font-bold">${match}</span>${after}`
        }

        for (const p of found) {
          if (!highlights[p.id]) {
            const titleSnippet = makeBold(p.title || '', search)
            const descSnippet = !titleSnippet ? makeBold(p.description || '', search) : null
            if (titleSnippet || descSnippet) {
              highlights[p.id] = { title: titleSnippet, content: descSnippet }
            }
          }
        }

        if (!isCancelled) {
          setFilteredProjects(found)
          setHighlightsByProject(highlights)
        }
      } catch (e) {
        const foundProjects = projects.filter(({ title }) =>
          title?.toLowerCase()?.includes(search.toLowerCase()),
        )
        if (!isCancelled) {
          setFilteredProjects(foundProjects)
          setHighlightsByProject({})
        }
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [search, projects])

  const hasRegularProjects = !isEmpty(filteredProjects)
  const showOnboarding = !search && !!onboardingProject
  const showSetupMessage = !hasRegularProjects && !showOnboarding

  return (
    <ul className='flex flex-col flex-1 h-full divide-y-[1px] divide-borders-purple'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {hasRegularProjects &&
            filteredProjects.map((project) => (
              <li key={'dashboard-project-' + project.id}>
                <div
                  className='px-10 py-5 hover:cursor-pointer hover:bg-hoverBox'
                  onClick={() => (window.location.href = `/${project.id}`)}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h1 className='text-xl p-0 m-0'>{project.title}</h1>
                      {search &&
                        (highlightsByProject[project.id]?.title ||
                          highlightsByProject[project.id]?.content) && (
                          <p className='text-sm p-0 m-0 text-[#47444F]'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: (
                                  highlightsByProject[project.id]?.title ||
                                  highlightsByProject[project.id]?.content ||
                                  ''
                                )
                                  .replace(/<mark>/g, '<span class="font-bold">')
                                  .replace(/<\/mark>/g, '</span>'),
                              }}
                            />
                          </p>
                        )}
                      {!search && <p className='text-sm p-0 m-0'>{project.description}</p>}
                    </div>
                    {!onboardingProject || project.id !== onboardingProject.id ? (
                      <UserList users={project.users as IUser[]} />
                    ) : null}
                  </div>
                </div>
              </li>
            ))}

          {showOnboarding && (
            <li key={'dashboard-project-' + onboardingProject.id}>
              <ProjectPreview project={onboardingProject} />
            </li>
          )}

          {showSetupMessage && (
            <li className='flex-1'>
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
