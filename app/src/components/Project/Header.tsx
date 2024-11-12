import { useNavigate, useParams } from 'react-router-dom'

import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import { useProject } from '../../context/ProjectContext'
import { SearchIcon, RingIcon } from '../icons'

export function ProjectHeader() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { search, setSearch } = useProject()
  // const badgeCount = 5

  return (
    <header className='flex justify-between items-center border-b bg-[#edebf3] h-14 border-border-color'>
      <div
        onClick={() => navigate(`/${projectId}`)}
        className='w-80 h-full border-r border-border-color p-2 flex justify-center items-center text-black hover:cursor-pointer'
      >
        <Logo />
      </div>
      <div className='flex-1 flex items-center px-6 gap-3 relative bg-[#edebf3]'>
        <SearchIcon className='absolute left-0  w-5 h-5 text-[#969696]' />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Find it all'
          className='bg-[#edebf3] text-[#969696] text-sm font-normal font-agron'
        />
      </div>
      <div className='flex px-7 py-2 items-center h-full w-48 border-l border-border-color  justify-center '>
        <div className='flex items-center gap-4'>
          <RingIcon className='w-5 h-5' />
          <span className="text-[#46434e] text-xs font-normal font-['Monaspace Argon Var'] ml-1">
            {/* +{badgeCount} */}
          </span>
        </div>
        <div className='h-full flex items-center p-5'>
          <UserPanel user={user} />
        </div>
      </div>
    </header>
  )
}

export default ProjectHeader
