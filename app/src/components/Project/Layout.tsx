import { Navigate, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications'

import { ProjectHeader } from './Header'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import LeftPanel from './LeftPanel'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import { CreateProject } from './CreateProject'
import { Loader } from '../ui/Loader'
import { useAuth } from '../../context/AuthContext'
import { addUserToProject } from '../../services'
import { ITeamMember } from '../../types/User'
import { useProjectAccess } from '../../hooks/useProjectAccess'

function ProjectContent() {
  const { id: projectId = '' } = useParams()
  const { project } = useProject()
  const { isMobile } = useBreakpoint()
  const { loading: authLoading } = useAuth()
  const { checked, allow, isLoading } = useProjectAccess()

  if (!project?.id && !isLoading) return <CreateProject projectId={projectId} />

  if (isLoading || authLoading || !checked) return <Loader />

  if (!allow) return <Navigate to='/dashboard' />

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
  const { id: projectId } = useParams<{ id: string }>()

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectContent />
    </ProjectProvider>
  )
}
