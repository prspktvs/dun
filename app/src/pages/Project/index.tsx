import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

import { ICard } from '../../types/Card'
import Card from '../../components/Card'
import CreateProject from '../../components/Project/CreateProject'
import CreateUser from '../../components/User/CreateUser'
import { addUserToProject, getProjectCards } from '../../services'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/ui/Logo'
import UserPanel from '../../components/User/UserPanel'
import AllCardsContent from '../../components/Project/Content/AllCardsContent'
import { genId } from '../../utils'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import { useSearch } from '../../components/ui/Search'
import LeftPanel from '../../components/Project/LeftPanel'

const Project = () => {
  const { id: projectId = '', cardId } = useParams()
  const { user } = useAuth()
  const [searchText, setSearchText] = useState('')
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)
  const search = useSearch(searchText, projectId)

  const { project, isLoading, cards, optimisticCreateCard } = useProject()

  const [selectedCard, setSelectedCard] = useState<Partial<ICard> | null>(null)

  useEffect(() => {
    if (!cardId && isEmpty(cards)) return

    const card = cards?.find((card) => card.id === cardId)

    setSelectedCard(card as Partial<ICard>)
  }, [cards, cardId])

  const navigate = useNavigate()

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })

    navigate(`/${projectId}/cards/${id}#share`, { replace: true })
  }

  if (isLoading) return null

  if (!project) return <CreateProject projectId={projectId} />

  if (!user) return <CreateUser projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      <header className='flex justify-between items-center border-b-1 bg-grayBg h-14 border-border-color'>
        <div
          onClick={() => navigate(`/${projectId}`)}
          className='w-80 border-r-1 border-border-color p-2 text-4xl text-center  text-black hover:cursor-pointer'
        >
          <Logo />
        </div>
        <div className='justify-self-start pl-6 flex items-center flex-1'>
          <i className='absolute ri-search-line text-xl text-gray-400' />
          <input
            className='block pl-7 align-middle overflow-hidden border-none bg-grayBg text-sm font-monaspace'
            value={searchText}
            onChange={onSearch}
            placeholder='Find it all'
          />
          {search.loading ? (
            <div className='absolute right-0 top-0 bottom-0 flex items-center justify-center w-12 bg-grayBg'>
              <i className='ri-loader-2-line animate-spin text-gray-400' />
            </div>
          ) : null}
        </div>

        <div className='h-full flex items-center p-5 '>
          <UserPanel user={user} />
        </div>
      </header>

      <div className='flex h-full w-full overflow-y-hidden'>
        {/* Left panel */}
        <LeftPanel projectId={projectId} title={project.title} />

        {selectedCard && selectedCard.id === cardId ? (
          <Card card={selectedCard} users={project.users} />
        ) : (
          <AllCardsContent
            onCreateNewCard={onCreateNewCard}
            projectId={projectId}
            cards={cards}
            users={project.users || []}
            search={search}
          />
        )}
      </div>
    </div>
  )
}

const ProjectPage = () => {
  const { id: projectId = '' } = useParams()
  return (
    <ProjectProvider projectId={projectId}>
      <Project />
    </ProjectProvider>
  )
}

export default ProjectPage
