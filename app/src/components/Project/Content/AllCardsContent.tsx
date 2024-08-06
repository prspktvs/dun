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
import ButtonDun from '../../ui/buttons/ButtonDun'
import { ISearchResult } from '../../components/ui/Search'
import clsx from 'clsx'
import { useProject } from '../../../context/ProjectContext'

function SortButton({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className={clsx('', isActive && 'bg-grayBg')}>
      {children}
    </button>
  )
}

export default function AllCardsContent({
  onCreateNewCard,
  search,
}: {
  onCreateNewCard: () => void
  search: { q: string; loading: boolean; results: ISearchResult[] }
}) {
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const { setSortType, sortType, cards, users } = useProject()

  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    setFilteredCards(search.q ? search.results : cards)
  }, [search.q, cards])

  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  return (
    <main className='w-full h-full overflow-hidden pb-32'>
      <section className='border-border-color flex items-center justify-between h-14 '>
        <div className='h-full flex w-full border-b-1 border-border-color sm:gap-x-1 '>
          <div className='flex gap-x-4 md:w-10/12 text-xs font-normal font-monaspace items-center ml-5 '>
            <SortButton
              onClick={() => setSortType('updatedAt')}
              isActive={sortType === 'updatedAt'}
            >
              Last modified
            </SortButton>
            <SortButton
              onClick={() => setSortType('createdAt')}
              isActive={sortType === 'createdAt'}
            >
              Date created
            </SortButton>
            {/* <SortButton>Archived</SortButton> */}
          </div>

          <div className='h-full w-48 border-l-1 border-border-color'>
            <ButtonDun onClick={onCreateNewCard}>
              <span className='pr-1 text-xl font-thin'>+</span>Topic
            </ButtonDun>
          </div>
        </div>
      </section>
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
    </main>
  )
}
