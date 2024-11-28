import { useNavigate } from 'react-router-dom'

import Logo from '../../ui/Logo'

interface LogoSectionProps {
  projectId: string
}

export function LogoSection({ projectId }: LogoSectionProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/${projectId}`)}
      className='flex items-center justify-center h-full p-2 text-black border-r w-80 border-border-color hover:cursor-pointer'
    >
      <Logo />
    </div>
  )
}
