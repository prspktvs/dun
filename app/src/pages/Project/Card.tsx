import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import _debounce from 'lodash/debounce'
import clsx from 'clsx'

import { ICard } from '../../types/Card'
import { useProject } from '../../context/ProjectContext'
import { ChatProvider, useChats } from '../../context/ChatContext'
import { FilePreviewProvider } from '../../context/FilePreviewContext'
import { Loader } from '../../components/ui/Loader'
import { useAuth } from '../../context/AuthContext'
import CardTabs from './CardTabs'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { ShareTopicModal } from '../../components/ui/modals/ShareTopicModal'
import CardHeader from '../../components/Card/CardHeader'
import Editor from '../../components/Editor'
import CardContent from '../../components/Card/CardContent'
import OnboardingEditor from '../../components/Editor/OnboardingEditor'
import { ONBOARDING_EDITOR_ID, ROLES } from '../../constants/roles.constants'

interface ICardProps {
  card: ICard
}

type RightPanelTab = 'discussions' | 'attachments' | 'editor' | 'sharing'

const Card = ({ card }: ICardProps) => {
  const { id: projectId = '', chatId } = useParams()

  const location = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { closeChat, unreadChats, cardChats } = useChats()
  const { optimisticDeleteCard, optimisticUpdateCard, users, hasPermission, isOnboarding } =
    useProject()
  const { isMobile } = useBreakpoint()

  const [isFirstTimeViewed, setFirstTimeViewed] = useState(location.hash === '#new')
  const [isShareModalOpened, setIsShareModalOpened] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [activeTab, setActiveTab] = useState<RightPanelTab>(isMobile ? 'editor' : 'discussions')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const files = card?.files?.filter((file) => file.url) || []

  const isAuthor = card.author === user?.id
  const canShareAndRemoveTopic = isAuthor || hasPermission(ROLES.OWNER)

  const canEditTitle = isOnboarding && user?.id !== ONBOARDING_EDITOR_ID

  const unreadDiscussions = unreadChats.reduce(
    (acc, chat) => (card.chatIds?.includes(chat.id) ? acc + chat.unreadCount : acc),
    0,
  )

  useEffect(() => {
    if (!chatId) return
    setActiveTab('discussions')
  }, [chatId])

  useEffect(() => {
    setTitle(card.title)
  }, [card.title])

  useEffect(() => {
    const textarea = inputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [title])

  useEffect(() => {
    if (!title.length) inputRef.current?.focus()
  }, [])

  const onDebouncedSave = useCallback(
    _debounce(async (title) => {
      await onSaveTitle(title)
    }, 1500),
    [card.id, card.public],
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

  const goBack = async () => {
    await onSaveTitle(title)
    closeChat()
    const backTo = location.state?.backTo ?? `/${projectId}`
    navigate(backTo)
  }

  return (
    <div className={clsx(isMobile ? 'w-full' : 'w-[calc(100vw_-_320px)]')}>
      <CardHeader
        goBack={goBack}
        canShareAndRemoveTopic={canShareAndRemoveTopic}
        openShareModal={openShareModal}
        isFirstTimeViewed={isFirstTimeViewed}
        updateSharingMode={updateSharingMode}
        onRemoveCard={onRemoveCard}
      />
      <div className='flex'>
        {!isMobile && (
          <section className='h-[calc(100vh_-_112px)] flex-1 hide-scrollbar overflow-y-scroll overflow-x-hidden bg-white z-20 pt-[20px] pl-[10px] '>
            <textarea
              className='font-rubik align-middle min-h-[40px] text-[32px] border-none ml-12 mb-6 resize-none overflow-hidden bg-white w-[300px] md:w-3/4 lg:w-5/6'
              placeholder='Type title'
              rows={1}
              ref={inputRef}
              value={title}
              onChange={onTitleChange}
              disabled={canEditTitle}
            />
            <Editor key={card.id} card={card} users={users} />
          </section>
        )}
        <aside
          className={clsx(
            'md:border-l-1 border-borders-purple',
            isMobile ? 'w-full' : 'w-[320px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px]',
          )}
        >
          <CardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cardChatsLength={cardChats.length}
            unreadDiscussions={unreadDiscussions}
            filesLength={files.length}
            isAuthor={isAuthor}
            openShareModal={openShareModal}
          />

          <CardContent
            card={card}
            projectId={projectId}
            title={title}
            setTitle={setTitle}
            onTitleChange={onTitleChange}
            users={users}
            inputRef={inputRef}
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            files={files}
          />
        </aside>
      </div>

      {!isMobile && (
        <ShareTopicModal
          opened={isShareModalOpened}
          onClose={() => setIsShareModalOpened(false)}
          card={card}
        />
      )}
    </div>
  )
}

export function CardPage() {
  const { cardId, id: projectId } = useParams()
  const { cards } = useProject()
  const [isLoading, setLoading] = useState(true)
  const [card, setCard] = useState<ICard | undefined>()

  useEffect(() => {
    if (!cards.length || !cardId) return
    const foundCard = cards?.find((card) => card.id === cardId)
    setCard(foundCard)
    setLoading(false)
  }, [cards, cardId])

  if (isLoading) return <Loader />

  if (!card) return <Navigate to={`/${projectId}`} />

  return (
    <ChatProvider>
      <FilePreviewProvider files={card?.files || []}>
        <Card card={card} />
      </FilePreviewProvider>
    </ChatProvider>
  )
}
