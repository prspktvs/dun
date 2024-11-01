import { useNavigate, useParams } from 'react-router-dom'
import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import { useProject } from '../../context/ProjectContext'
import { SearchIcon } from '../icons'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { search, setSearch } = useProject()

  return (
    <header className='flex justify-between items-center border-b-1 bg-[#edebf3] h-14 border-border-color'>
      <div
        onClick={() => navigate(`/${projectId}`)}
        className='w-80 border-r-1 border-border-color p-2 flex justify-center items-center text-black hover:cursor-pointer'
      >
        <Logo />
      </div>
      <div className='flex-1 flex items-center px-6 relative bg-[#edebf3]'>
        <SearchIcon className='absolute left-0 pl-1 w-5 h-5 text-[#969696]' />
        <span className="text-[#969696] text-sm font-normal font-['MonaspaceArgon'] pl-4">
          Find it all
        </span>
      </div>
      <div className='h-full flex items-center p-5'>
        <UserPanel user={user} />
      </div>
    </header>
  )
}

export default ProjectHeader
