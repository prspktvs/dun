import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import { ProjectSettings } from '../../components/Project/ProjectSettings'

export function SettingPage() {
  const { id: projectId } = useParams()

  const { isOnboarding } = useProject()

  if (isOnboarding) return <Navigate to={`/${projectId}`} replace />

  return (
    <div className='flex flex-col w-full h-[calc(100vh-52px)]'>
      <section className='flex-none border-borders-purple border-b-1 flex items-center h-14' />

      <div className='flex flex-col flex-1 min-h-0'>
        <ProjectSettings onClose={() => {}} />
      </div>
    </div>
  )
}
