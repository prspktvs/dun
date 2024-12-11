import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'

import { ProjectHeader } from './Header'
import LeftPanel from './LeftPanel'
import { useAuth } from '../../context/AuthContext'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import CreateProject from './CreateProject'
import { Loader } from '../ui/Loader'

export function ProjectLayout() {
  const { id: projectId = '' } = useParams()
  const { project } = useProject()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  if (!project) return <CreateProject projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      <ProjectHeader />
      <div className='flex flex-col w-full h-full overflow-y-hidden md:flex-row'>
        <LeftPanel />
        <div className='flex flex-col w-full h-full'>
          {isMobile && (
            <div className='justify-center hidden w-full h-full border-b-1 border-borders-purple md:flex '>
              {/* Содержимое карточки */}
            </div>
          )}
          <Outlet />
        </div>
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
