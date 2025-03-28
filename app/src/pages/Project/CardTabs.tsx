import clsx from 'clsx'

import { useBreakpoint } from '../../hooks/useBreakpoint'
import UnreadIndicator from '../../components/ui/UnreadIndicator'

type RightPanelTab = 'discussions' | 'attachments' | 'editor' | 'sharing'

interface CardTabsProps {
  activeTab: RightPanelTab
  setActiveTab: (tab: RightPanelTab) => void
  cardChatsLength: number
  unreadDiscussions: number
  filesLength: number
  isAuthor: boolean
  openShareModal: () => void
}
const CardTabs = ({
  activeTab,
  setActiveTab,
  cardChatsLength,
  unreadDiscussions,
  filesLength,
  isAuthor,
  openShareModal,
}: CardTabsProps) => {
  const { isMobile } = useBreakpoint()

  if (!isMobile) {
    return (
      <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
        <div className='w-full grid grid-cols-2 h-full divide-x-[1px] divide-borders-gray border-borders-purple'>
          <div
            className={clsx(
              'flex items-center justify-center font-monaspace text-14 lg:text-sm',
              activeTab === 'discussions'
                ? 'bg-background text-black'
                : 'bg-grayBg text-inactiveText',
            )}
            onClick={() => setActiveTab('discussions')}
          >
            Discussions• {cardChatsLength}
            <UnreadIndicator
              size='sm'
              count={unreadDiscussions}
              className='relative -top-2 left-1'
            />
          </div>
          <div
            className={clsx(
              'flex items-center justify-center font-monaspace text-14 lg:text-sm',
              activeTab === 'attachments'
                ? 'bg-background text-black'
                : 'bg-grayBg text-inactiveText',
            )}
            onClick={() => setActiveTab('attachments')}
          >
            Attachments• {filesLength}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-between md:h-14 border-b-1 border-borders-purple'>
      <div className='w-full overflow-x-auto hide-scrollbar'>
        <div className='inline-flex h-full divide-x-[1px] divide-borders-gray border-borders-purple'>
          <div
            className={clsx(
              'flex items-center justify-center font-monaspace text-sm px-3 py-2 lg:text-sm whitespace-nowrap w-[120px]',
              activeTab === 'editor'
                ? 'bg-background text-black'
                : 'bg-[#edebf3] text-inactiveText',
            )}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </div>
          <div
            className={clsx(
              'flex items-center justify-center font-monaspace text-14 lg:text-sm whitespace-nowrap px-6',
              activeTab === 'discussions'
                ? 'bg-background text-black'
                : 'bg-[#edebf3] text-inactiveText',
            )}
            onClick={() => setActiveTab('discussions')}
          >
            Discussions• {cardChatsLength}
            <UnreadIndicator
              size='sm'
              count={unreadDiscussions}
              className='relative -top-2 left-2'
            />
          </div>
          <div
            className={clsx(
              'flex items-center justify-center font-monaspace text-14 lg:text-sm whitespace-nowrap px-3',
              activeTab === 'attachments'
                ? 'bg-background text-black'
                : 'bg-[#edebf3] text-inactiveText',
            )}
            onClick={() => setActiveTab('attachments')}
          >
            Attachments• {filesLength}
          </div>
          {isAuthor && (
            <div
              className={clsx(
                'flex items-center justify-center font-monaspace text-14 lg:text-sm whitespace-nowrap w-[120px]',
                activeTab === 'sharing'
                  ? 'bg-background text-black'
                  : 'bg-[#edebf3] text-inactiveText',
              )}
              onClick={() => {
                setActiveTab('sharing')
                openShareModal()
              }}
            >
              Sharing
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardTabs
