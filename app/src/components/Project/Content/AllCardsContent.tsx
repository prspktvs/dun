import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Accordion } from '@mantine/core'
import { isEmpty } from 'lodash'
import Card from '../../Card'
import { IUser } from '../../../types/User'
import { ICard } from '../../../types/Card'
import CardPreview from '../../Card/CardPreview'
import { useNavigate, useParams } from 'react-router'
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
  onCreateNewCard: () => void
  search: string
}) {
  const { id: projectId } = useParams()
  const navigate = useNavigate()

  const [filteredCards, setFilteredCards] = useState<ICard[]>(cards)
  const [showModal, setShowModal] = useState(false) // State for controlling modal visibility
  const scrollContainerRef = useRef(null)
  const [showTextEros, setShowTextEros] = useState(false)

  console.log(users)

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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

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

  const toggleText = () => {
    setShowTextEros((prevState) => !prevState)
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
        <div className='h-full flex w-full border-b-2 border-border-color sm:gap-x-1 '>
          <div className='flex gap-x-4 md:w-10/12 text-xs font-normal font-monaspace items-center ml-5 '>
            <div className='hidden md:flex'>Last viewed</div>
            <div className='hidden md:flex'>
              Last modified
              <div className='hidden md:flex'>{/* <UnreadMarker /> */}</div>
            </div>
            <div className='flex bg-grayBg p-2'>Date created</div>
          </div>

          <div className='flex h-full items-center border-l-1 border-border-color md:px-7 sm:px-2'>
            <ProjectUsers users={users} />
          </div>
          <div
            onClick={() => setShowModal(true)}
            className='border-r-2 border-border-color flex items-center justify-center px-2'
          >
            {/* Trigger Modal */}
            <SettingSvg />
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
      {/* <div className='w-full h-14 px-6 py-3 bg-stone-50 justify-between items-center inline-flex border-b-2 border-border-color'>
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
          <div className='grid xl:grid-cols-3 lg:grid-cols-2'>
            {filteredCards.map((card, index) => (
              <div key={'card-' + index} className='border-b-1 border-border-color padding-0'>
                <CardPreview card={card} onClick={() => onChooseCard(card)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {/* <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        withCloseButton={true}
        title='Project settings'
        size='60%'
        padding={0}
        overlayProps={{
          backgroundOpacity: 0.6,
        
        }}
      > */}

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        withCloseButton={true}
        title='Project settings'
        size='60%'
        padding={0}
        styles={{
          inner: {
            overflow: 'hidden',
          },
          body: {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 150px)', // Adjust the height to fit within the screen
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        overlayProps={{
          backgroundOpacity: 0.6,
        }}
      >
        <div className='h-[800px] flex flex-col'>
          <div onClick={toggleText} className='font-medium cursor-pointer m-3 text-xl font-bold'>
            EROS
          </div>
          <div className={clsx(showTextEros ? 'block' : 'hidden', 'ml-3')}>
            The Enterprise Resource Optimization System (EROS) is a cutting-edge IT project designed
            to revolutionize the way our organization manages and utilizes its resources. EROS
            integrates advanced technologies and smart algorithms to streamline and optimize key
            business processes, ensuring maximum efficiency and resource utilization across
            departments.{' '}
          </div>
          <div className='flex items-center gap-x-1.5 text-[#8279BD] font-semibold m-3'>
            <div>Archived topics</div>
            <ArrowSquareRight />
          </div>

          <div className='flex mt-4 justify-between  items-center border-y-2 border-border-color'>
            <div className='font-bold ml-3 font-monaspace'>Invite link</div>
            <div className='text-sm my-5'>https://dun.wtf/KfXvOA1e47oQy1ttnWrc</div>

            <Button
              className='font-monaspace bg-[#8279BD] text-right w-[150px] h-[50px] mr-3'
              radius={0}
              variant='outline'
              color='#FFFFFF'
            >
              Copy
            </Button>
          </div>
          <div className='flex justify-between  items-center border-b-2 border-border-color'>
            <div className='font-bold ml-3 font-monaspace'>Invite by email</div>
            <div style={{ backgroundColor: 'red' }} className='flex justify-items-start'>
              <input className='text-sm outline-none' placeholder='Type your team member email' />
            </div>

            <Button
              className='font-monaspace w-[150px] h-[50px] mr-3 my-2'
              radius={0}
              variant='outline'
              color='#FFFFFF'
              disabled
            >
              Invite
            </Button>
          </div>
          <div className='flex items-center justify-between'>
            <div className='ml-3 font-bold font-monaspace'>Your team</div>
            <div className='flex items-center gap-x-2 my-3 bg-[#EDEBF3] mr-5 w-[400px]'>
              <div className='flex items-center m-1 ml-5'>
                <SearchIcon />
              </div>
              <input
                placeholder='Find them '
                className='block align-middle w-full overflow-hidden border-none bg-[#EDEBF3] text-xs '
              />
            </div>
          </div>
          {/* <div className='max-h-[230px]  border-y-2 border-border-color flex flex-col'> */}
          <div
            className={clsx(
              showTextEros ? 'h-[125px]' : 'h-[225px]',
              'border-y-2 border-border-color flex flex-col',
            )}
          >
            <div className='flex overflow-x-auto flex-col'>
              {!isEmpty(users)
                ? users.map((user, index) => (
                    <>
                      <div className='my-2 ml-3 flex items-center'>
                        <div>
                          <ProjectUsers key={index} users={[user]} />
                        </div>

                        <div className='ml-3 w-[550px]'>
                          <div className='text-base font-medium '>{user.name}</div>
                          <div className='text-sm '>{user.email}</div>
                        </div>
                        <div className='text-base font-monaspace'>Owner</div>
                        <div className='ml-3'>
                          <Menu2 />
                        </div>
                      </div>
                    </>
                  ))
                : null}
            </div>
          </div>
          <div className='border-border-color flex items-center font-monaspace'>
            <div className='flex-1 ml-3 border-r-2'>
              <input
                className='w-full text-sm my-5 outline-none'
                placeholder='Type project title to delete it'
              />
            </div>

            <Button
              className='font-monaspace mr-3'
              radius={0}
              variant='transparent'
              color='#969696'
            >
              Delete project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
