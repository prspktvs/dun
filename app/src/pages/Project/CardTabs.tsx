import clsx from 'clsx'

import UnreadIndicator from '../../components/ui/UnreadIndicator'

type RightPanelTab = 'editor' | 'discussions' | 'attachments'

interface CardTabsProps {
  activeTab: RightPanelTab
  setActiveTab: (tab: RightPanelTab) => void
  cardChatsLength: number
  unreadDiscussions: number
  filesLength: number
}

const CardTabs = ({
  activeTab,
  setActiveTab,
  cardChatsLength,
  unreadDiscussions,
  filesLength,
}: CardTabsProps) => (
  <div className='flex items-center justify-between h-14 border-b-1 border-borders-purple'>
    <div className='w-full grid grid-cols-3 h-full divide-x-[1px] divide-borders-gray border-borders-purple '>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14 px-3 lg:text-sm',
          activeTab === 'editor' ? 'bg-background text-black' : 'bg-[#edebf3] text-inactiveText',
        )}
        onClick={() => setActiveTab('editor')}
      >
        Editor
      </div>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14  lg:text-sm',
          activeTab === 'discussions'
            ? 'bg-background text-black'
            : 'bg-[#edebf3] text-inactiveText',
        )}
        onClick={() => setActiveTab('discussions')}
      >
        Discussions• {cardChatsLength}
        <UnreadIndicator size='sm' count={unreadDiscussions} className='relative -top-2 left-1' />
      </div>
      <div
        className={clsx(
          'flex items-center justify-center font-monaspace text-14 lg:text-sm',
          activeTab === 'attachments'
            ? 'bg-background text-black'
            : 'bg-[#edebf3] text-inactiveText',
        )}
        onClick={() => setActiveTab('attachments')}
      >
        Attachments• {filesLength}
      </div>
    </div>
  </div>
)

export default CardTabs
