import { SearchIcon } from '../../icons'
import { useProject } from '../../../context/ProjectContext'

export function Search() {
  const { search, setSearch } = useProject()

  return (
    <div className='flex-1 flex items-center px-6 gap-3 relative bg-[#edebf3]'>
      <SearchIcon className='absolute left-0 w-5 h-5 text-[#969696]' />
      <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Find it all'
        className='bg-[#edebf3] text-[#969696] text-sm font-normal font-agron focus:outline-none'
      />
    </div>
  )
}
