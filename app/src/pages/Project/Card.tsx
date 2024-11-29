import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import _debounce from 'lodash/debounce'
import { Menu } from '@mantine/core'
import clsx from 'clsx'

import { ICard } from '../../types/Card'
import { useProject } from '../../context/ProjectContext'
import { ChatProvider, useChats } from '../../context/ChatContext'
import Editor from '../../components/Editor'
import UnreadIndicator from '../../components/ui/UnreadIndicator'
import Discussions from '../../components/Card/Sections/Discussions'
import Attachments from '../../components/Card/Sections/Attachments'
import Updates from '../../components/Card/Sections/Updates'
import { FilePreviewProvider } from '../../context/FilePreviewContext'
import { Loader } from '../../components/ui/Loader'
import ButtonDun from '../../components/ui/buttons/ButtonDun'
import { ShareTopicModal } from '../../components/ui/modals/ShareTopicModal'
import { ConfirmModal } from '../../components/ui/modals/ConfirmModal'
import { useAuth } from '../../context/AuthContext'
import { SharingMenu } from '../../components/Card/Sharing/SharingMenu'

interface ICardProps {
  card: ICard
}

const CardHeader = ({
  goBack,
  isAuthor,
  openShareModal,
  isFirstTimeViewed,
  updateSharingMode,
  setShowConfirmModal,
  showConfirmModal,
  onRemoveCard,
}: {
  goBack: () => void
  isAuthor: boolean
  openShareModal: () => void
  isFirstTimeViewed: boolean
  updateSharingMode: (isPrivate: boolean) => void
  setShowConfirmModal: (value: boolean) => void
  showConfirmModal: boolean
  onRemoveCard: () => void
}) => (
  <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
    <div className='flex items-center mx-3 justify-between grow h-full'>
      <div className='underline font-monaspace text-sm hover:cursor-pointer' onClick={goBack}>
        {'<'} Back to topics
      </div>
      {isAuthor && (
        <div className='flex items-center gap-1 h-full'>
          <div className='relative h-full w-full'>
            <ButtonDun onClick={openShareModal}>Share topic</ButtonDun>
            {isFirstTimeViewed && (
              <SharingMenu
                openFullSharingModal={openShareModal}
                updateSharingMode={updateSharingMode}
              />
            )}
          </div>
          <Menu shadow='md' radius={0} width={200}>
            <Menu.Target>
              <i
                onClick={(e) => e.stopPropagation()}
                className='ri-more-2-fill text-2xl cursor-pointer'
              />
            </Menu.Target>

            <Menu.Dropdown className='shadow-[6px_6px_0px_0px_#C1BAD0]'>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation()
                  setShowConfirmModal(true)
                }}
                className='text-red-600'
              >
                Remove topic
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ConfirmModal
            message='Are you sure you want to remove this topic?'
            confirmText='Remove'
            onClose={() => setShowConfirmModal(false)}
            onConfirm={onRemoveCard}
            opened={showConfirmModal}
          />
        </div>
      )}
    </div>
  </div>
)

const CardTabs = ({
  activeTab,
  setActiveTab,
  cardChatsLength,
  unreadDiscussions,
  filesLength,
}: {
  activeTab: 'discussions' | 'attachments' | 'updates'
  setActiveTab: (tab: 'discussions' | 'attachments' | 'updates') => void
  cardChatsLength: number
  unreadDiscussions: number
  filesLength: number
}) => (
  <div className='flex items-center justify-between h-14 border-b-1 border-border-color'>
    <div className='w-full grid grid-cols-3 h-full divide-x-[1px] divide-borders-gray border-border-color '>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14 lg:text-sm',
          activeTab === 'discussions' ? 'bg-cloudy text-black' : 'bg-grayBg text-inactiveText',
        )}
        onClick={() => setActiveTab('discussions')}
      >
        Discussions• {cardChatsLength}
        <UnreadIndicator size='sm' count={unreadDiscussions} className='relative -top-2 left-1' />
      </div>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14 lg:text-sm',
          activeTab === 'attachments' ? 'bg-cloudy text-black' : 'bg-grayBg text-inactiveText',
        )}
        onClick={() => setActiveTab('attachments')}
      >
        Attachments• {filesLength}
      </div>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14 lg:text-sm',
          activeTab === 'updates' ? 'bg-cloudy text-black' : 'bg-grayBg text-inactiveText',
        )}
        onClick={() => setActiveTab('updates')}
      >
        Updates
      </div>
    </div>
  </div>
)

const Card = ({ card }: ICardProps) => {
  const { id: projectId = '' } = useParams()
  const location = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { closeChat, unreadChats, cardChats } = useChats()
  const { optimisticDeleteCard, optimisticUpdateCard, users } = useProject()

  const [isFirstTimeViewed, setFirstTimeViewed] = useState(location.hash === '#new')
  const [isShareModalOpened, setIsShareModalOpened] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [activeTab, setActiveTab] = useState<'discussions' | 'attachments' | 'updates'>(
    'discussions',
  )
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const files = card?.files?.filter((file) => file.url) || []

  const isAuthor = card.author === user?.id

  const unreadDiscussions = unreadChats.reduce(
    (acc, chat) => (card.chatIds?.includes(chat.id) ? acc + chat.unreadCount : acc),
    0,
  )

  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    const maxHeight = 144
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [title])

  useEffect(() => {
    if (!title.length) inputRef.current?.focus()
  }, [])

  const onDebouncedSave = useCallback(
    _debounce(async (title) => {
      await onSaveTitle(title)
    }, 1500),
    [],
  )

  const clearUrlHash = () => navigate(location.pathname + location.search, { replace: true })

  const openShareModal = () => {
    setFirstTimeViewed(false)
    setIsShareModalOpened(true)
    clearUrlHash()
  }

  const updateSharingMode = (isPrivate: boolean) => {
    setFirstTimeViewed(false)
    optimisticUpdateCard({ ...card, public: !isPrivate })
    clearUrlHash()
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setTitle(val)
    onDebouncedSave(val)
  }

  const onSaveTitle = (t: string) => optimisticUpdateCard({ ...card, title: t })

  const onRemoveCard = async () => {
    if (!card?.id) return
    await optimisticDeleteCard(card.id)
    goBack()
  }

  const goBack = () => {
    closeChat()
    navigate(`/${projectId}`)
  }

  return (
    <div className='w-[calc(100%_-_320px)]'>
      <CardHeader
        goBack={goBack}
        isAuthor={isAuthor}
        openShareModal={openShareModal}
        isFirstTimeViewed={isFirstTimeViewed}
        updateSharingMode={updateSharingMode}
        setShowConfirmModal={setShowConfirmModal}
        showConfirmModal={showConfirmModal}
        onRemoveCard={onRemoveCard}
      />
      <div className='flex'>
        <section className='h-[calc(100vh_-_112px)] flex-1 hide-scrollbar overflow-y-scroll overflow-x-hidden z-20 pt-[20px] pl-[30px] '>
          <textarea
            className='font-rubik align-middle h-auto min-h-[40px] text-[32px] border-none ml-12 mb-6 resize-none overflow-hidden w-[300px] md:w-3/4 lg:w-5/6'
            rows={1}
            placeholder='Type title'
            ref={inputRef}
            value={title}
            onChange={onTitleChange}
          />
          <Editor key={card.id} projectId={projectId} card={card} users={users} />
        </section>
        <aside className='border-l-1 border-border-color w-[320px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]'>
          <CardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cardChatsLength={cardChats.length}
            unreadDiscussions={unreadDiscussions}
            filesLength={files.length}
          />
          {
            {
              discussions: <Discussions users={users} />,
              attachments: <Attachments files={files} />,
              updates: <Updates />,
            }[activeTab]
          }
        </aside>
      </div>
      <ShareTopicModal
        opened={isShareModalOpened}
        onClose={() => setIsShareModalOpened(false)}
        card={card}
      />
    </div>
  )
}

export function CardPage() {
  const { cardId } = useParams()
  const { cards } = useProject()

  const card = cards?.find((card) => card.id === cardId)

  return (
    <ChatProvider>
      <FilePreviewProvider files={card?.files || []}>
        {card ? <Card card={card} /> : <Loader />}
      </FilePreviewProvider>
    </ChatProvider>
  )
}
