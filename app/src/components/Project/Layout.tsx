import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'

import { ProjectHeader } from './Header'
import LeftPanel from './LeftPanel'
import { useAuth } from '../../context/AuthContext'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import CreateProject from './CreateProject'

function ProjectContent() {
  const { id: projectId = '' } = useParams()
  const { project } = useProject()

  if (!project) return <CreateProject projectId={projectId} />

  return (
    <ProjectProvider projectId={projectId}>
      <div className='h-screen overflow-y-hidden'>
        <ProjectHeader />
        <div className='flex h-full w-full overflow-y-hidden'>
          <LeftPanel />
          <Outlet />
        </div>
      </div>
    </ProjectProvider>
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
