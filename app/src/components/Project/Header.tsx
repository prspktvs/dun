import { useNavigate, useParams } from 'react-router-dom'
import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import { useProject } from '../../context/ProjectContext'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { search, setSearch } = useProject()

  return (
    <header className='flex justify-between items-center border-b-1 bg-grayBg h-14 border-border-color'>
      <div
        onClick={() => navigate(`/${projectId}`)}
        className='w-80 border-r-1 border-border-color p-2 text-4xl text-center  text-black hover:cursor-pointer'
      >
        <Logo />
      </div>
      <div className='justify-self-start pl-6 flex items-center flex-1'>
        <i className='absolute ri-search-line text-xl text-gray-400' />
        <input
          className='block pl-7 align-middle overflow-hidden border-none bg-grayBg text-sm font-monaspace'
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder='Find it all'
        />
      </div>

      <div className='h-full flex items-center p-5 '>
        <UserPanel user={user} />
      </div>
    </header>
  )
}
