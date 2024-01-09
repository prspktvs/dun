import ProjectUsers from '../../User/ProjectUsers'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import Card from '../../Card'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import CardPreview from '../../Card/CardPreview'
import { useNavigate, useParams } from 'react-router'

export default function AllCardsContent({
  users,
  cards,
  onCreateNewCard,
}: {
  users: IUser[]
  cards: ICard[]
  projectId: string
  onCreateNewCard: () => void
}) {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  return (
    <div>
      {/* Search line */}
      <div className='flex items-center justify-between h-20 border-b-2 border-gray-border'>
        <div>search</div>
        <div className='h-full flex'>
          <div className='w-52 border-l-2 border-r-2 border-gray-border flex items-center justify-center px-5'>
            <ProjectUsers users={users} />
          </div>
          <div className='w-52 flex items-center justify-center px-5'>
            <Button radius={0} variant='outline' color='#464646' onClick={onCreateNewCard}>
              New Topic
            </Button>
          </div>
        </div>
      </div>
      {/* Cards */}
      <div className='grid grid-cols-3'>
        {isEmpty(cards) ? (
          <div className='text-center h-full w-full text-gray-300'>No cards</div>
        ) : (
          cards
            .sort(({ createdAt: a }, { createdAt: b }) => b - a)
            .map((card, index) => (
              <CardPreview card={card} key={'card-' + index} onClick={() => onChooseCard(card)} />
            ))
        )}
      </div>
    </div>
  )
}
