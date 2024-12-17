import React from 'react'

import { SearchIcon } from '../icons'

interface SearchBarProps {
  search: string
  setSearch: (value: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <div className='flex-1 flex items-center px-4 md:px-6 md:gap-3 gap-2 relative md:bg-[#edebf3]'>
      <SearchIcon className='absolute left-0 w-5 h-5 text-[#969696]' />
      <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Find it all'
        className='md:bg-[#edebf3] text-[#969696] text-sm font-normal font-agron'
      />
    </div>
  )
}

export default SearchBar
