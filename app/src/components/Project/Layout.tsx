import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'

import { ProjectHeader } from './Header'
import LeftPanel from './LeftPanel'
import { useAuth } from '../../context/AuthContext'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import CreateProject from './CreateProject'
import { Loader } from '../ui/Loader'

export function ProjectLayout() {
  const { id: projectId = '' } = useParams()
  const { project } = useProject()

  if (!project) return <CreateProject projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      <ProjectHeader />
      <div className='flex h-full w-full overflow-y-hidden'>
        <LeftPanel />
        <Outlet />
      </div>
    </div>
  )
}

export function ProjectLayoutWithProtection() {
  const { id: projectId = '', cardId } = useParams()
  const { isAuthenticated, loading } = useAuth()

  const from = cardId ? `/${projectId}/cards/${cardId}` : `/${projectId}`

  return loading ? (
    <Loader />
  ) : (
    <ProjectProvider projectId={projectId}>
      {!isAuthenticated ? <Navigate to='/login' state={{ from }} /> : <ProjectLayout />}
    </ProjectProvider>
  )
}
