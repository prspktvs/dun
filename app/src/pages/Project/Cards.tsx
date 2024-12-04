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

  const { setSortType, sortType, cards, search: searchText, optimisticCreateCard } = useProject()
  const search = useSearch(searchText, projectId)

  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)

  useEffect(() => {
    setFilteredCards(search.q ? search.results : cards)
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

    navigate(`/${projectId}/cards/${id}#share`, { replace: true })
  }

  return (
    <div className='w-full h-full pb-32 overflow-hidden'>
      <section className='flex items-center justify-between border-border-color h-14'>
        <div className='flex justify-center w-full h-full border-b-1 border-border-color'>
          <div className='items-center hidden ml-6 text-xs font-normal md:flex gap-x-4 md:w-full font-monaspace'>
            <div className=' text-xs text-[#47444F] font-normal font-monaspace'>Sort by:</div>
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

            {/* TODO: Add 'archived' sort option when functionality is available
<SortButton onClick={() => setSortType('archived')} isActive={sortType === 'archived'}>
  Archived
</SortButton> */}
          </div>

          <div className='items-center justify-center flex-shrink-0 hidden w-48 h-full border-l md:flex border-border-color'>
            <ButtonDun onClick={onCreateNewCard} className='w-full h-full'>
              <span className='text-xl font-thin'>+</span>Topic
            </ButtonDun>
          </div>
        </div>
      </section>
      <section className='h-full overflow-y-scroll hide-scrollbar'>
        {!isEmpty(filteredCards) ? (
          <div className='grid xl:grid-cols-3 lg:grid-cols-2'>
            {filteredCards.map((card, index) => (
              <div key={'card-' + index} className='border-b-1 border-border-color padding-0'>
                <CardPreview card={card} onClick={() => onChooseCard(card)} />
              </div>
            ))}
          </div>
        ) : search.loading ? (
          <Loader />
        ) : (
          <div className='w-full mt-10 text-center text-gray-300'>No cards found</div>
        )}
      </section>
    </div>
  )
}
