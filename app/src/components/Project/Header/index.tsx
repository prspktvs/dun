import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../../context/AuthContext'
import { useProject } from '../../../context/ProjectContext'
import { LogoSection } from './LogoSection'
import { Search } from './Search'
import { UserSection } from './UserSection'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const { user } = useAuth()

  return (
    <header className='flex justify-between items-center border-b bg-[#edebf3] h-14 border-border-color'>
      <LogoSection projectId={projectId} />
      <Search />
      <UserSection user={user} />
    </header>
  )
}

export default ProjectHeader
