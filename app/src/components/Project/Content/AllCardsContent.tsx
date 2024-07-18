import ProjectUsers from '../../User/ProjectUsers'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import Card from '../../Card'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import CardPreview from '../../Card/CardPreview'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, UnreadMarker } from '../../icons'

function ScrollUpdatedCardControls({
  length,
  onLeftClick,
  onRightClick,
}: {
  length: number
  onLeftClick: () => void
  onRightClick: () => void
}) {
  return (
    <div className='justify-start items-center gap-2 flex'>
      <RiArrowRightSLine onClick={onLeftClick} />
      <div className='text-zinc-700 text-sm font-normal font-monaspace'>{length}</div>
      <RiArrowLeftSLine onClick={onRightClick} />
    </div>
  )
}

export default function AllCardsContent({
  users,
  cards,
  onCreateNewCard,
  search,
}: {
  users: IUser[]
  cards: ICard[]
  projectId: string
  onCreateNewCard: () => void
  search: string
}) {
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const updatedCards = cards
      .filter((card) => card?.title?.toLowerCase()?.includes(search.toLowerCase()))
      .sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1
        if (a.createdAt < b.createdAt) return 1
        return
      })

    setFilteredCards(updatedCards)
  }, [search, cards])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  const handleScrollForward = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      const offset = scrollContainer.offsetWidth / 3
      scrollContainer.scrollBy({ left: offset * 3, behavior: 'smooth' })
    }
  }

  const handleScrollBack = () => {
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      const offset = scrollContainer.offsetWidth / 3
      scrollContainer.scrollBy({ left: -offset * 3, behavior: 'smooth' })
    }
  }

  return (
    <div className='w-full h-full overflow-hidden pb-32'>
      {/* Search line */}
      <div className='border-border-color flex items-center justify-between h-14 '>
        {/* <div className='relative mx-3 w-full'>
          <i className='absolute ri-search-line text-2xl text-gray-400' />
          <input
            className='block pl-7 align-middle text-xl w-full overflow-hidden border-none'
            value={search}
            onChange={onSearch}
          />
        </div> */}
        <div className='h-full flex w-full border-b-1 border-border-color sm:gap-x-1 '>
          <div className='flex gap-x-4 md:w-10/12 text-xs font-normal font-monaspace items-center ml-5 '>
            <div className='hidden md:flex'>Last viewed</div>
            <div className='hidden md:flex'>
              Last modified
              <div className='hidden md:flex'>{/* <UnreadMarker /> */}</div>
            </div>
            <div className='flex bg-[#EDEBF3] p-2'>Date created</div>
          </div>

          <div className='flex h-full items-center border-x-1 border-border-color md:px-7 sm:px-2'>
            <ProjectUsers users={users} />
          </div>

          <div className='flex items-center md:justify-center md:px-5 sm:px-3  '>
            <Button
              className='font-monaspace bg-[#8279BD]'
              radius={0}
              variant='outline'
              color='#FFFFFF'
              onClick={onCreateNewCard}
            >
              <span className='pr-1 text-xl font-thin'>+</span>Topic
            </Button>
          </div>
        </div>
      </div>
      {/* Cards */}
      {/* <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-b-1 border-border-color'>
        <div className='text-zinc-700 text-xs font-normal font-monaspace flex gap-x-4'>
          <div className='flex items-center gap-x-2 bg-[#EDEBF3] p-2'>
            Tab <UnreadMarker />
          </div>
          <div className='flex items-center gap-x-2'>
            Last modified <UnreadMarker />
          </div>
          <div className='flex items-center gap-x-2'>
            Date created <UnreadMarker />
          </div>
        </div>
      </div> */}
      <div className=' h-full overflow-y-scroll hide-scrollbar'>
        {isEmpty(filteredCards) ? (
          <div className='text-center mt-10 w-full text-gray-300'>No cards found</div>
        ) : (
          <div className='grid xl:grid-cols-3 lg:grid-cols-2 '>
            {filteredCards.map((card, index) => (
              <div key={'card-' + index} className='border-b-1 border-border-color padding-0'>
                <CardPreview card={card} onClick={() => onChooseCard(card)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
