import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ICard } from '../../types/Card'
import Card from '../../components/Card'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import CreateProject from '../../components/Project/CreateProject'
import { saveOrCreateCard } from '../../services/cards'
import { useNavigate } from 'react-router-dom'
import { useFirebaseDocument } from '../../hooks/useFirebaseDocument'
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection'
import CreateUser from '../../components/User/CreateUser'
import ProjectUsers from '../../components/User/ProjectUsers'
import MyTasks from '../../components/Task/MyTasks'
import { addUserToProject } from '../../services/project'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/ui/Logo'
import UserPanel from '../../components/User/UserPanel'
import AllCardsContent from '../../components/Project/Content/AllCardsContent'
import { genId } from '../../utils'

interface IProjectPageProps {}

const ProjectPage = (props: IProjectPageProps) => {
  const { id: projectId = '', cardId } = useParams()
  const { user } = useAuth()

  const { data: project, loading: projectLoading } = useFirebaseDocument(`projects/${projectId}`)

  const { data: cards, loading: cardsLoading } = useFirebaseCollection(
    `projects/${projectId}/cards`,
  )

  const [selectedCard, setSelectedCard] = useState<Partial<ICard> | null>(null)

  useEffect(() => {
    if (projectLoading || !user) return

    const isUserExists = project?.users?.some(({ id }) => id === user.id)
    if (!isUserExists) addUserToProject(projectId, user)
  }, [project])

  useEffect(() => {
    if (cardId && !isEmpty(cards)) {
      const card = cards?.find((card) => card.id === cardId)
      const emptyCreatedCard: Partial<ICard> = {
        id: cardId,
        title: '',
        content: [],
        createdAt: new Date(),
      }
      setSelectedCard(card || emptyCreatedCard)
    }
  }, [cards, cardId])

  const isLoading = cardsLoading || projectLoading

  const navigate = useNavigate()

  const onCreateNewCard = async () => {
    // const newCard: Partial<ICard> = {
    //   title: '',
    // }
    // const card = await saveOrCreateCard(projectId, newCard)
    const id = genId()

    navigate(`/${projectId}/cards/${id}`, { replace: true })
  }

  if (isLoading) return null

  if (!project) return <CreateProject projectId={projectId} />

  if (!user) return <CreateUser projectId={projectId} />

  return (
    <div className='h-screen overflow-y-hidden'>
      {/* Header */}
      <div className='flex justify-between items-center border-b-2 bg-[#EDEBF3] h-14 border-[#A3A1A7]'>
        <div
          onClick={() => navigate(`/${projectId}`)}
          className='w-80 border-r-2 border-[#A3A1A7] p-5 text-4xl text-center  text-black hover:cursor-pointer'
        >
          <Logo />
        </div>
        <div className='h-full flex items-center p-5 border-l-2 border-[#A3A1A7]'>
          <UserPanel user={user} />
        </div>
      </div>

      <div className='flex h-full w-full'>
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
          />
        )}
      </div>
    </div>
  )
}

export default ProjectPage
