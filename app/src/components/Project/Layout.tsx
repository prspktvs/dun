import { useEffect, useState } from 'react'
import { ProjectHeader } from './Header'
import LeftPanel from './LeftPanel'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import { Loader, LoadingOverlay } from '@mantine/core'
import CreateProject from './CreateProject'

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

  if (loading)
    return (
      <div className='h-screen w-screen flex justify-center items-center'>
        <Loader type='dots' />
      </div>
    )

  return (
    <ProjectProvider projectId={projectId}>
      {!isAuthenticated ? <Navigate to='/login' state={{ from }} /> : <ProjectLayout />}
    </ProjectProvider>
  )
}
