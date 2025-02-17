import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import { SearchIcon } from '../icons'

export function Header({
  onLogoClick,
  search,
  setSearch,
}: {
  onLogoClick: () => void
  search: string
  setSearch: (value: string) => void
}) {
  const { user } = useAuth()

  return (
    <header className='flex justify-between items-center border-b bg-[#edebf3] h-14 border-borders-purple'>
      <div
        onClick={onLogoClick}
        className='flex items-center justify-center h-full p-2 text-black border-r w-80 border-borders-purple hover:cursor-pointer'
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
          className='bg-[#edebf3] text-[#969696] text-sm font-normal font-agron w-full focus:outline-none h-full'
        />
      </div>
      <div className='flex items-center justify-center w-48 h-full py-2 border-l px-7 border-borders-purple '>
        <div className='flex items-center h-full p-5'>
          <UserPanel user={user} />
        </div>
      </div>
    </header>
  )
}

export default Header
