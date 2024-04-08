import ProjectUsers from '../../User/ProjectUsers'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import Card from '../../Card'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import CardPreview from '../../Card/CardPreview'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from './IconsCard'

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
  // const [search, setSearch] = useState('')
  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const updatedCards = cards
      .filter((card) => card?.title?.toLowerCase()?.includes(search.toLowerCase()))
      .sort(({ createdAt: a }, { createdAt: b }) => b - a)
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
    <div className='w-full h-full overflow-y-hidden pb-32'>
      {/* Search line */}
      <div className='border-border-color flex items-center justify-between h-14 border-b-2 '>
        {/* <div className='relative mx-3 w-full'>
          <i className='absolute ri-search-line text-2xl text-gray-400' />
          <input
            className='block pl-7 align-middle text-xl w-full overflow-hidden border-none'
            value={search}
            onChange={onSearch}
          />
        </div> */}
        <div className='h-full flex w-full '>
          <div className='w-52 border-r-2 border-border-color flex items-center justify-end px-5 flex-1'>
            <ProjectUsers users={users} />
          </div>
          <div className='w-52 flex items-center justify-center px-5'>
            <Button
              className='font-monaspace'
              radius={0}
              variant='outline'
              color='#464646'
              onClick={onCreateNewCard}
            >
              <span className='pr-1 text-xl font-thin'>+</span>Topic
            </Button>
          </div>
        </div>
      </div>
      {/* Cards */}
      <div className='h-full overflow-y-scroll hide-scrollbar'>
        {isEmpty(filteredCards) ? (
          <div className='text-center mt-10 w-full text-gray-300'>No cards found</div>
        ) : (
          <>
            <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-b-2 border-border-color'>
              <div className='text-zinc-700 text-sm font-normal font-monaspace'>
                What's new • {filteredCards.length}
              </div>
              <ScrollUpdatedCardControls
                length={filteredCards.length}
                onLeftClick={handleScrollBack}
                onRightClick={handleScrollForward}
              />
            </div>
            <div ref={scrollContainerRef} className='flex overflow-x-scroll snap-x snap-mandatory'>
              {filteredCards
                .sort(({ createdAt: a }, { createdAt: b }) => b - a)
                .map((card, index) => (
                  <div className='w-1/3 flex-none snap-center'>
                    <CardPreview
                      card={card}
                      key={'card-' + index}
                      onClick={() => onChooseCard(card)}
                    />
                  </div>
                ))}
            </div>

            <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-y-2 border-border-color'>
              <div className='text-zinc-700 text-sm font-normal font-monaspace'>All topics</div>
              {/* <div className='justify-start items-end flex'>
                <div className=' h-5 text-slate-400 text-sm font-medium font-monaspace'>
                  Last modified
                </div>
                <RiArrowDown />
              </div> */}
            </div>

            <div className='grid grid-cols-3'>
              {filteredCards.map((card, index) => (
                <div key={'card-' + index} className='border-b-2 border-border-color padding-0'>
                  <CardPreview card={card} onClick={() => onChooseCard(card)} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
