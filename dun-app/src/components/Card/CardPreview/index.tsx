import { isEmpty } from 'lodash'
import { ICard } from '../../../types/Card'
import { Image } from '@mantine/core'

interface ICardPreviewProps {
  card: ICard
  onClick: () => void
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function CardPreview({ card, onClick }: ICardPreviewProps) {
  const imageUrls = card?.files
    ?.filter((file) => file.type === 'image')
    ?.slice(0, 2)
    ?.map((file) => file.url)
  const imagesCount = imageUrls ? imageUrls.length : 0
  const createdAt = new Date(card.createdAt.seconds * 1000)
  const day = createdAt.getDate()
  const month = months[createdAt.getMonth()]
  const hours = createdAt.getHours() < 10 ? '0' + createdAt.getHours() : createdAt.getHours()
  const minutes =
    createdAt.getMinutes() < 10 ? '0' + createdAt.getMinutes() : createdAt.getMinutes()

  return (
    <div className='w-full h-72 border rounded-lg p-3 hover:cursor-pointer' onClick={onClick}>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-xl'>{card.title}</div>
          <div className='text-xs text-gray-500'>{`${day} ${month} at ${hours}:${minutes}`}</div>
        </div>
        <div className='text-sm font-bold'>{imagesCount + ' images'}</div>
      </div>
      <div className='grid grid-cols-5 mt-5'>
        {!isEmpty(imageUrls) ? (
          <div className='flex col-span-2 h-40'>
            {imagesCount === 1 ? (
              <Image
                radius='md'
                className='w-full h-full object-contain'
                src={imageUrls[0]}
                alt=''
              />
            ) : (
              imageUrls?.map((url) => (
                <Image key={'image-' + url} radius='md' className='w-1/2' src={url} alt='' />
              ))
            )}
          </div>
        ) : null}

        <div className='col-span-3'>
          {card?.description?.map((line) => (
            <div key={'description-' + line}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardPreview
