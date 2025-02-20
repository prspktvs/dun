import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import { SearchIcon } from '../icons'
import SearchBar from '../Project/SearchBar'

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
      <SearchBar search={search} setSearch={setSearch} />
      <div className='flex items-center justify-center w-48 h-full py-2 border-l px-7 border-borders-purple '>
        <div className='flex items-center h-full p-5'>
          <UserPanel user={user} />
        </div>
      </div>
    </header>
  )
}

export default Header
