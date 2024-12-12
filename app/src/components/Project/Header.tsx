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

  return (
    <header className='flex justify-between items-center border-b bg-[#edebf3] h-14 border-border-color'>
      <div
        onClick={() => navigate(`/${projectId}`)}
        className='flex items-center justify-center h-full p-2 text-black border-r w-80 border-border-color hover:cursor-pointer'
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
      <div className='flex items-center justify-center w-48 h-full py-2 border-l px-7 border-border-color '>
        {/* <div className='flex items-center gap-4'>
          <RingIcon className='w-5 h-5' />
          <span className="text-[#46434e] text-xs font-normal font-monaspace ml-1">
          </span>
        </div> */}
        <div className='flex items-center h-full p-5'>
          <UserPanel user={user} />
        </div>
      </div>
    </header>
  )
}

export default ProjectHeader
