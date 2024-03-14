import ProjectUsers from '../../User/ProjectUsers'
import { Button } from '@mantine/core'
import { isEmpty } from 'lodash'
import Card from '../../Card'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import CardPreview from '../../Card/CardPreview'
import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowDown } from './IconsCard/IconsCard'

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
  const [search, setSearch] = useState('')
  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)

  useEffect(() => {
    const updatedCards = cards.filter((card) => card.title.includes(search))
    setFilteredCards(updatedCards)
  }, [search, cards])

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  return (
    <div className='w-full h-full overflow-y-hidden'>
      {/* Search line */}
      <div className='border-[#A3A1A7] flex items-center justify-between h-14 border-b-2  '>
        <div className='relative mx-3'>
          <i className='absolute ri-search-line text-2xl text-gray-400' />
          <input
            className='block pl-7 align-middle text-xl w-full overflow-hidden border-none'
            value={search}
            onChange={onSearch}
          />
        </div>
        <div className='h-full flex'>
          <div className='w-52 border-l-2 border-r-2 border-[#A3A1A7] flex items-center justify-center px-5'>
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
            <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-b-2 border-[#A3A1A7]'>
              <div className="text-zinc-700 text-sm font-normal font-monaspace">
                What's new • {filteredCards.length}
              </div>
              <div className='justify-start items-center gap-2 flex'>
                <RiArrowRightSLine />
                <div className="text-zinc-700 text-sm font-normal font-monaspace">
                  {filteredCards.length}
                </div>
                <RiArrowLeftSLine />
              </div>
            </div>
            <div className='flex overflow-x-scroll'>
              {filteredCards
                .sort(({ createdAt: a }, { createdAt: b }) => b - a)
                .map((card, index) => (
                  <div className='w-1/3 flex-none'>
                    <CardPreview
                      card={card}
                      key={'card-' + index}
                      onClick={() => onChooseCard(card)}
                    />
                  </div>
                ))}
            </div>

            <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-y-2 border-[#A3A1A7]'>
              <div className="text-zinc-700 text-sm font-normal font-monaspace">
                All topics
              </div>
              <div className='justify-start items-end flex '>
                <div className=" h-5 text-slate-400 text-sm font-medium font-monaspace">
                  Last modified
                </div>
                <RiArrowDown />
              </div>
            </div>

            <div className='grid grid-cols-3'>
              {filteredCards
                .sort(({ createdAt: a }, { createdAt: b }) => b - a)
                .map((card, index) => (
                  <div className='border-b-2 border-[#A3A1A7]'>
                    <CardPreview
                      card={card}
                      key={'card-' + index}
                      onClick={() => onChooseCard(card)}
                    />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
