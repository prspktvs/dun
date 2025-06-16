import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Header from '../../components/ui/Header'
import { ProjectsList } from '../../components/Project/ProjectPreview'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { getRandomProjectRoute } from '../../utils'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import SearchBar from '../../components/Project/SearchBar'
import { Modal } from '../../components/ui/modals/Modal'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const { isMobile } = useBreakpoint()
  const [showNoAccessModal, setShowNoAccessModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('noaccess') === '1') {
      setShowNoAccessModal(true)

      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate])

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
      <Modal
        size='md'
        opened={showNoAccessModal}
        onClose={() => setShowNoAccessModal(false)}
        noHeader
      >
        <h1 className='mx-5 text-center'>Ooops!</h1>
        <div className='my-3 mx-5 text-justify'>
          To access this project, ask the person who sent you the link to share an invite link from
          the project settings. This link doesn’t provide access to the project.
        </div>
      </Modal>
    </div>
  )
}
