import { useNavigate, useParams } from 'react-router-dom'

import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import { ProjectSettings } from '../../components/Project/ProjectSettings'

export function SettingPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { optimisticCreateCard } = useProject()

  const onCreateNewCard = async () => {
    const id = genId()
    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })
    navigate(`/${projectId}/cards/${id}#new`, { replace: true })
  }

  return (
    <div className='flex flex-col w-full h-[calc(100vh-12px)]'>
      {/* Header */}
      <section className='flex-none border-borders-purple border-b-1 flex items-center h-14' />

      {/* Content with fixed height and scroll */}
      <div className='flex-1 min-h-0 pb-5'>
        <div className='h-full mx-auto'>
          <ProjectSettings onClose={() => {}} />
        </div>
      </div>
    </div>
  )
}
