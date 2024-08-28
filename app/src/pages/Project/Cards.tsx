import clsx from 'clsx'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject } from '../../context/ProjectContext'
import { useEffect, useRef, useState } from 'react'
import { ICard } from '../../types/Card'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { isEmpty } from 'lodash'
import CardPreview from '../../components/Card/CardPreview'
import { genId } from '../../utils'
import { useSearch } from '../../components/ui/Search'
import { Loader } from '../../components/ui/Loader'
import { useAuth } from '../../context/AuthContext'

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
      <section className=' h-full overflow-y-scroll hide-scrollbar'>
        {!isEmpty(filteredCards) ? (
          <div className='grid xl:grid-cols-3 lg:grid-cols-2 '>
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
