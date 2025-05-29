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
import ProjectSelector from '../../components/Project/ProjectSelector'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import UserPanel from '../../components/User/UserPanel'
import SearchBar from '../../components/Project/SearchBar'
import { logAnalytics } from '../../utils/analytics'
import { ANALYTIC_EVENTS } from '../../constants'

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
  const { isMobile } = useBreakpoint()

  const {
    setSortType,
    sortType,
    cards,
    search: searchText,
    setSearch,
    optimisticCreateCard,
  } = useProject()
  const search = useSearch(searchText, projectId)

  useEffect(() => {
    logAnalytics(ANALYTIC_EVENTS.PAGE_OPEN, { page: 'project_cards', projectId })
  }, [])

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
      <section>
        {isMobile && (
          <div className='flex w-full items-center justify-between border-b-1 border-borders-purple px-5'>
            <ProjectSelector />
            <UserPanel />
          </div>
        )}
        <div className='flex items-center justify-between h-10 border-borders-purple md:h-14'>
          <div className='flex justify-between w-full h-full border-b-1 border-borders-purple'>
            {isMobile ? (
              <SearchBar search={searchText} setSearch={setSearch} />
            ) : (
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
            )}
            <div className='flex items-center justify-center flex-shrink-0 md:w-48 w-[111px] h-full border-l border-borders-purple'>
              <ButtonDun onClick={onCreateNewCard} className='w-full h-full'>
                <span className='justify-center text-sm font-normal font-monaspace pr-1 md:font-thin md:text-xl'>
                  +
                </span>
                Topic
              </ButtonDun>
            </div>
          </div>
        </div>
      </section>
      <section className='h-full overflow-y-scroll hide-scrollbar'>
        {!isEmpty(cards) ? (
          <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2'>
            {cards.map((card, index) => (
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
