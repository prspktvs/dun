import { useLocation, useNavigate, useParams } from 'react-router-dom'

import LeftPanelButton from '../../ui/buttons/LeftPanelButton'
import { useProject } from '../../../context/ProjectContext'

interface NavigationProps {
  isSettingsOpened: boolean
  onSettingsOpen: () => void
}

export function Navigation({ isSettingsOpened, onSettingsOpen }: NavigationProps) {
  const { id: projectId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { cards } = useProject()
  const topicCount = cards?.length || 0

  return (
    <nav className='w-full px-5 pb-1 border-b-1 border-border-color'>
      <ul>
        <li className='mb-2'>
          <LeftPanelButton
            isActive={location.pathname.endsWith('my-work') && !isSettingsOpened}
            onClick={() => navigate('my-work')}
          >
            My work
          </LeftPanelButton>
        </li>
        <li className='mb-2'>
          <LeftPanelButton
            isActive={location.pathname.endsWith(projectId) && !isSettingsOpened}
            onClick={() => navigate(`/${projectId}`)}
          >
            Topics ・{topicCount}
          </LeftPanelButton>
        </li>
        <li className='mb-2'>
          <LeftPanelButton isActive={isSettingsOpened} onClick={onSettingsOpen}>
            Project settings
          </LeftPanelButton>
        </li>
      </ul>
    </nav>
  )
}
