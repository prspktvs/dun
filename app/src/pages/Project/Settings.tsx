import { useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { groupBy } from 'lodash'

import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { genId } from '../../utils'
import { useProject } from '../../context/ProjectContext'
import { ProjectSettings } from '../../components/Project/ProjectSettingsModal'

export function SettingPage() {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { optimisticCreateCard, tasks, cards } = useProject()

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })

    navigate(`/${projectId}/cards/${id}#new`, { replace: true })
  }
  return (
    <div className='w-full h-full overflow-hidden pb-32'>
      <section className='border-borders-purple border-b-1 flex items-center h-14 ' />

      <div className='py-5'>
        <ProjectSettings onClose={() => {}} />
      </div>
    </div>
  )
}
