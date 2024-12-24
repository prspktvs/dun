import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
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
import CardTabs from './CardTabs' // Импортируем компонент CardTabs

interface ICardProps {
  card: ICard
}

type RightPanelTab = 'discussions' | 'attachments' | 'editor'

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
  <div className='flex items-center justify-between h-14 border-b-1 bg-[#edebf3] border-borders-purple'>
    <div className='flex items-center justify-between h-full mx-3 grow'>
      <div className='text-sm md:underline font-monaspace hover:cursor-pointer' onClick={goBack}>
        {'<'} Back to topics
      </div>
      {isAuthor && (
        <div className='flex items-center h-full gap-1'>
          <div className='relative hidden w-full h-full sm:block'>
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
                className='text-2xl cursor-pointer ri-more-2-fill'
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
  const [activeTab, setActiveTab] = useState<RightPanelTab>('discussions')
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
    <div className='md:w-[calc(100%_-_320px)]'>
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
      <div className='md:hidden'>
        <CardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cardChatsLength={cardChats.length}
          unreadDiscussions={unreadDiscussions}
          filesLength={files.length}
        />
      </div>
      <div className='md:flex'>
        <section className='h-[calc(100vh_-_112px)] flex-1 hide-scrollbar overflow-y-scroll overflow-x-hidden z-20 pt-[20px] pl-[30px] '>
          {activeTab === 'editor' && (
            <textarea
              className='font-rubik align-middle h-auto min-h-[40px] text-[32px] border-none ml-12 mb-6 resize-none overflow-hidden w-[300px] md:w-3/4 lg:w-5/6'
              rows={1}
              placeholder='Type title'
              ref={inputRef}
              value={title}
              onChange={onTitleChange}
            />
          )}
          {activeTab === 'editor' && (
            <Editor key={card.id} projectId={projectId} card={card} users={users} />
          )}
        </section>
        <aside className='hidden md:block md:border-l-1 border-borders-purple w-[320px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]'>
          <CardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cardChatsLength={cardChats.length}
            unreadDiscussions={unreadDiscussions}
            filesLength={files.length}
          />
          {
            {
              editor: <Editor key={card.id} projectId={projectId} card={card} users={users} />,
              discussions: <Discussions users={users} />,
              attachments: <Attachments files={files} />,
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
  const { cardId, id: projectId } = useParams()
  const { cards } = useProject()

  const card = cards?.find((card) => card.id === cardId)

  return (
    <ChatProvider>
      <FilePreviewProvider files={card?.files || []}>
        {card ? <Card card={card} /> : <Navigate to={`/${projectId}`} />}
      </FilePreviewProvider>
    </ChatProvider>
  )
}
