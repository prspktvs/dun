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
    <div className='w-full h-full overflow-hidden pb-32'>
      <section className='border-border-color flex items-center justify-between h-14'>
        <div className='h-full flex w-full border-b-1 border-border-color sm:gap-x-1 justify-center'>
          <div className='flex gap-x-4 md:w-10/12 text-xs font-normal font-monaspace items-center ml-6'>
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

            {/* TODO: Add 'archived' sort option when functionality is available
<SortButton onClick={() => setSortType('archived')} isActive={sortType === 'archived'}>
  Archived
</SortButton> */}
          </div>

          <div className='h-full w-48 border-l-1 border-border-color flex items-center justify-center '>
            <ButtonDun onClick={onCreateNewCard}>
              <span className='pr-0 text-xl font-thin'>+</span>Topic
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
          <div className='text-center mt-10 w-full text-gray-300'>No cards found</div>
        )}
      </section>
    </div>
  )
}
