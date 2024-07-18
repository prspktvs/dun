import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ICard } from '../../types/Card'
import Card from '../../components/Card'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import CreateProject from '../../components/Project/CreateProject'
import { useNavigate } from 'react-router-dom'
import { useFirebaseDocument } from '../../hooks/useFirebaseDocument'
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection'
import CreateUser from '../../components/User/CreateUser'
import ProjectUsers from '../../components/User/ProjectUsers'
import MyTasks from '../../components/Task/MyTasks'
import { addUserToProject, getProjectCards } from '../../services'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/ui/Logo'
import UserPanel from '../../components/User/UserPanel'
import AllCardsContent from '../../components/Project/Content/AllCardsContent'
import { genId } from '../../utils'
import { ProjectProvider, useProject } from '../../context/ProjectContext'
import { createCard } from '../../services'

interface IProjectPageProps {}

const Project = (props: IProjectPageProps) => {
  const { id: projectId = '', cardId } = useParams()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const { project, isLoading, cards, optimisticCreateCard } = useProject()

  const [selectedCard, setSelectedCard] = useState<Partial<ICard> | null>(null)

  useEffect(() => {
    if (isLoading || !user) return

    const isUserExists = project?.users?.some(({ id }) => id === user.id)
    if (!isUserExists) addUserToProject(projectId, user)
  }, [project])

  useEffect(() => {
    if (!cardId && isEmpty(cards)) return

    const card = cards?.find((card) => card.id === cardId)

    setSelectedCard(card as Partial<ICard>)
  }, [cards, cardId])

  const navigate = useNavigate()

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({ id, title: '', chatIds: [], createdAt: new Date() })

    navigate(`/${projectId}/cards/${id}`, { replace: true })
  }

  if (isLoading) return null

  if (!project) return <CreateProject projectId={projectId} />

  if (!user) return <CreateUser projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      {/* Header */}
      <div className='flex justify-between items-center border-b-1 bg-[#EDEBF3] h-14 border-border-color'>
        <div
          onClick={() => navigate(`/${projectId}`)}
          className='w-80 border-r-1 border-border-color p-2 text-4xl text-center  text-black hover:cursor-pointer'
        >
          <Logo />
        </div>
        <div className='justify-self-start pl-6 flex items-center flex-1'>
          <i className='absolute ri-search-line text-xl text-gray-400' />
          <input
            className='block pl-7 align-middle overflow-hidden border-none bg-[#EDEBF3] text-sm font-monaspace'
            value={search}
            onChange={onSearch}
            placeholder='Find it all'
          />
        </div>

        <div className='h-full flex items-center p-5 '>
          <UserPanel user={user} />
        </div>
      </div>

      <div className='flex h-full w-full overflow-y-hidden'>
        {/* Left panel */}
        <MyTasks projectId={projectId} title={project.title} />

        {/* Right panel */}
        {selectedCard && selectedCard.id === cardId ? (
          <Card card={selectedCard} users={project.users} />
        ) : (
          <AllCardsContent
            onCreateNewCard={onCreateNewCard}
            projectId={projectId}
            cards={cards}
            users={project.users}
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
