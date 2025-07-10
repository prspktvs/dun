import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { showNotification } from '@mantine/notifications'

import { useProject } from '../context/ProjectContext'
import { useAuth } from '../context/AuthContext'
import { ITeamMember } from '../types/User'
import { addUserToProject } from '../services'
import { ONBOARDING_ID } from '../constants/routes.constants'

export function useProjectAccess() {
  const { id: projectId = '' } = useParams()
  const { project, isLoading, users } = useProject()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('inviteToken')
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [checked, setChecked] = useState(false)
  const [allow, setAllow] = useState(false)

  useEffect(() => {
    if (isLoading || authLoading || !project?.users) return

    if (!user) {
      navigate(`/login`)
      return
    }

    const isInProject = users?.some((u: ITeamMember) => u.id === user.id)
    if (isInProject || project.id === ONBOARDING_ID) {
      setAllow(true)
      setChecked(true)
      return
    }

    if (!inviteToken) {
      showNotification({ color: 'red', message: 'You have no access to this project' })
      navigate('/dashboard?noaccess=1')
      return
    }

    if (!project.inviteUrl?.endsWith(inviteToken)) {
      showNotification({ color: 'red', message: 'Invite link is invalid or expired' })
      navigate('/dashboard?noaccess=1')
      return
    }

    addUserToProject(projectId, {...user, role: 'viewer' }).then(() => {
      setAllow(true)
      setChecked(true)
    }).catch(() => navigate('/dashboard?noaccess=1'))
    
  }, [user, authLoading, projectId, inviteToken, navigate, isLoading, users, project])

  return { checked, allow, isLoading }
}