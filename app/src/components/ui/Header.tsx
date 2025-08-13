import Logo from '../ui/Logo'
import UserPanel from '../User/UserPanel'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../Project/SearchBar'
import ProjectSearch from '../Project/ProjectSearch'

export function Header({
  onLogoClick,
  search,
  setSearch,
  isProjectSearch = false,
}: {
  onLogoClick: () => void
  search: string
  setSearch: (value: string) => void
  isProjectSearch?: boolean
}) {
  const { user } = useAuth()

  return (
    <header className='flex justify-between items-center border-b bg-[#edebf3] h-14 border-borders-purple'>
      <div
        onClick={onLogoClick}
        className='flex items-center justify-center h-full p-2 text-black border-r border-borders-purple hover:cursor-pointer'
        style={{ width: 'var(--left-panel-width, 320px)' }}
      >
        <Logo />
      </div>
      <div className='flex-1'>
        {isProjectSearch ? (
          <ProjectSearch search={search} setSearch={setSearch} />
        ) : (
          <SearchBar search={search} setSearch={setSearch} />
        )}
      </div>
      <div className='flex items-center justify-center w-48 h-full py-2 border-l px-7 border-borders-purple '>
        <div className='flex items-center h-full p-5'>
          <UserPanel />
        </div>
      </div>
    </header>
  )
}

export default Header
