import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Header from '../../components/ui/Header'
import { ProjectsList } from '../../components/Project/ProjectPreview'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { genId } from '../../utils'

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const goToNewProject = () => navigate(`/${genId()}`)

  return (
    <div>
      <Header onLogoClick={() => navigate('/')} search={search} setSearch={setSearch} />
      <section className='flex items-center justify-end border-borders-purple h-14 border-b-1'>
        <div className='flex items-center justify-center flex-shrink-0 w-48 h-full border-l border-borders-purple'>
          <ButtonDun onClick={goToNewProject} className='w-full h-full'>
            <span className='text-xl font-thin pr-1'>+</span>Project
          </ButtonDun>
        </div>
      </section>
      <section className='overflow-y-scroll h-[calc(100vh-52px)]'>
        <ProjectsList />
      </section>
    </div>
  )
}
