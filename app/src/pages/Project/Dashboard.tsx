import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Header from '../../components/ui/Header'
import { ProjectsList } from '../../components/Project/ProjectPreview'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { getRandomProjectRoute } from '../../utils'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import SearchBar from '../../components/Project/SearchBar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { isMobile } = useBreakpoint()

  const goToNewProject = () => navigate(getRandomProjectRoute())

  return (
    <div>
      {!isMobile && (
        <Header onLogoClick={() => navigate('/')} search={search} setSearch={setSearch} />
      )}
      <section className='flex items-center justify-end border-borders-purple h-14 border-b-1'>
        {isMobile && <SearchBar search={search} setSearch={setSearch} />}
        <div className='flex items-center justify-center flex-shrink-0 w-48 h-full border-l border-borders-purple'>
          <ButtonDun onClick={goToNewProject} className='w-full h-full'>
            <span className='text-xl font-thin pr-1'>+</span>Project
          </ButtonDun>
        </div>
      </section>
      <section className='overflow-y-scroll h-[calc(100vh-120px)]'>
        <ProjectsList search={search} />
      </section>
    </div>
  )
}
