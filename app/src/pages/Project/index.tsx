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

interface IProjectPageProps {}

const ProjectPage = (props: IProjectPageProps) => {
  const { id: projectId = '', cardId } = useParams()

  const { data: project, loading: projectLoading } = useFirebaseDocument(`projects/${projectId}`)

  const { data: cards, loading: cardsLoading } = useFirebaseCollection(
    `projects/${projectId}/cards`,
  )

  const [cardOpenId, setCardOpenId] = useState<string>(cardId || '')

  const user = JSON.parse(localStorage.getItem('user') as string)

  useEffect(() => {
    if (projectLoading || !user) return

    const isUserExists = project?.users?.some(({ id }) => id === user.id)
    if (!isUserExists) addUserToProject(projectId, user)
  }, [project])

  const isLoading = cardsLoading || projectLoading

  const navigate = useNavigate()

  const onCreateNewCard = async () => {
    const newCard: Partial<ICard> = {
      title: '',
    }
    const card = await saveOrCreateCard(projectId, newCard)

    navigate(`/${projectId}/cards/${card.id}`, { replace: true })
    setCardOpenId(card.id)
  }

  if (isLoading) return null

  if (!project) return <CreateProject projectId={projectId} />

  if (!user) return <CreateUser projectId={projectId} />

  return (
    <div className='grid grid-cols-5 h-screen w-screen grid-rows-10 px-10'>
      {/* Header */}
      <div className='col-span-5 row-span-1 p-5 flex justify-between items-center'>
        <div className='text-4xl text-black'>{project.title}</div>
        <ProjectUsers users={project.users} />
      </div>

      {/* Buttons line: New topic, Search */}

      <div className='col-span-1 row-span-1 p-5' />
      <div className='col-span-4 row-span-1  p-5 flex items-center'>
        <Button radius={0} variant='filled' color='#464646' onClick={onCreateNewCard}>
          New Topic
        </Button>
      </div>

      {/* Left panel */}
      <div className='col-span-1 row-span-4 h-full p-5'>
        <MyTasks projectId={projectId} />
      </div>

      {/* Cards section */}
      <div className='col-span-4 h-full row-span-4 p-5'>
        <div className='flex flex-col gap-5'>
          {isEmpty(cards) ? (
            <div className='text-center h-full w-full text-gray-300'>No cards</div>
          ) : (
            cards
              .sort(({ createdAt: a }, { createdAt: b }) => b - a)
              .map((card, index) => (
                <Card
                  card={card}
                  users={project.users}
                  key={'card-' + index}
                  cardOpenId={cardOpenId}
                  projectId={projectId}
                />
              ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectPage
