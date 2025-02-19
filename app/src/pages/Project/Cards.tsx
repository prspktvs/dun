import clsx from 'clsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import { useProject } from '../../context/ProjectContext'
import { ICard } from '../../types/Card'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import CardPreview from '../../components/Card/CardPreview'
import { genId } from '../../utils'
import { useSearch } from '../../components/ui/Search'
import { Loader } from '../../components/ui/Loader'
import { ChatProvider } from '../../context/ChatContext'

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
    <button
      onClick={onClick}
      className={clsx('px-4 py-2 rounded', isActive ? 'bg-grayBg' : 'text-[#969696]')}
    >
      <span className='text-[#555555] text-xs font-normal font-monaspace'>{children}</span>
    </button>
  )
}

export function CardsPage() {
  const { id: projectId = '' } = useParams()
  const navigate = useNavigate()

  const {
    setSortType,
    sortType,
    cards,
    search: searchText,
    setSearch,
    optimisticCreateCard,
  } = useProject()
  const search = useSearch(searchText, projectId)

  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)

  useEffect(() => {
    const nonEmptyCards = cards.filter(
      (card) =>
        card.title ||
        card?.description?.length > 0 ||
        card?.tasks?.length > 0 ||
        card?.files?.length > 0,
    )
    setFilteredCards(search.q ? search.results : nonEmptyCards)
  }, [search.q, cards])

  const onChooseCard = (card: ICard) => {
    navigate(`/${projectId}/cards/${card.id}`)
  }

  const onCreateNewCard = async () => {
    const id = genId()

    await optimisticCreateCard({
      id,
      title: '',
      chatIds: [],
      createdAt: new Date(),
    })

    navigate(`/${projectId}/cards/${id}#new`, { replace: true })
  }

  return (
    <div className='w-full h-full pb-32 overflow-hidden'>
      <section className='flex items-center justify-between border-borders-purple h-14'>
        <div className='flex justify-center w-full h-full border-b-1 border-borders-purple'>
          <div className='flex items-center ml-6 text-xs font-normal gap-x-4 md:w-full font-monaspace'>
            <div className='text-xs text-[#47444F] font-normal font-monaspace'>Sort by:</div>
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
          </div>

          <div className='flex items-center justify-center flex-shrink-0 w-48 h-full border-l border-borders-purple'>
            <ButtonDun onClick={onCreateNewCard} className='w-full h-full'>
              <span className='text-xl font-thin pr-1'>+</span>Topic
            </ButtonDun>
          </div>
        </div>
      </section>
      <section className='h-full overflow-y-scroll hide-scrollbar'>
        {!isEmpty(filteredCards) ? (
          <div className='grid xl:grid-cols-3 lg:grid-cols-2'>
            {filteredCards.map((card, index) => (
              <div key={'card-' + index} className='border-b-1 border-borders-purple padding-0'>
                <CardPreview
                  card={card}
                  onClick={() => {
                    setSearch('')
                    onChooseCard(card)
                  }}
                />
              </div>
            ))}
          </div>
        ) : search.loading ? (
          <Loader />
        ) : (
          <div className='w-full mt-10 text-center text-gray-300'>No topics found</div>
        )}
      </section>
    </div>
  )
}
