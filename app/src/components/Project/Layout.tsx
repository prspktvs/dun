import { Outlet, useParams } from 'react-router-dom'

import { ProjectHeader } from './Header'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import LeftPanel from './LeftPanel'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import { CreateProject } from './CreateProject'

function ProjectContent() {
  const { id: projectId = '' } = useParams()
  const { project, isLoading } = useProject()
  const { isMobile } = useBreakpoint()

  if (isLoading) return null

  if (!project?.id && !isLoading) return <CreateProject projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      {!isMobile && <ProjectHeader />}
      <div className='w-full h-full overflow-y-hidden md:flex'>
        {!isMobile && <LeftPanel />}
        <Outlet />
      </div>
    </div>
  )
}

export function ProjectLayout() {
  const { id: projectId = '' } = useParams()

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectContent />
    </ProjectProvider>
  )
}
