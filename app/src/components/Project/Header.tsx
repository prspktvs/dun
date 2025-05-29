import { useNavigate, useParams } from 'react-router-dom'

import { useProject } from '../../context/ProjectContext'
import Header from '../ui/Header'
import { ROUTES } from '../../constants'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { search, setSearch } = useProject()

  return (
    <Header
      onLogoClick={() => navigate(ROUTES.DASHBOARD)}
      search={search}
      setSearch={setSearch}
      isProjectSearch
    />
  )
}

export default ProjectHeader
