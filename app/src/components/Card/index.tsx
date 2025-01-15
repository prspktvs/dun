import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'

interface CardProps {
  card: ICard
  users?: IUser[]
}

export default function Card({ card, users }: CardProps) {
  return (
    <div className='flex flex-col flex-1'>
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>{card.title}</h1>
        {card.description && <p className='mt-2 text-gray-600'>{card.description}</p>}
      </div>
    </div>
  )
}
