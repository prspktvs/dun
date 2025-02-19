import { useNavigate, useParams } from 'react-router-dom'

import { useProject } from '../../context/ProjectContext'
import Header from '../ui/Header'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { search, setSearch } = useProject()

  return (
    <Header onLogoClick={() => navigate(`/${projectId}`)} search={search} setSearch={setSearch} />
  )
}

export default ProjectHeader
