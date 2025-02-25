import { ICard, IUser } from '../../types'
import { IFile } from '../../types/File'
import Editor from '../Editor'
import { ShareTopicContent } from '../ui/modals/ShareTopicContent'
import Attachments from './Sections/Attachments'
import Discussions from './Sections/Discussions'

interface CardContentProps {
  card: ICard
  projectId: string
  title: string
  setTitle: (title: string) => void
  onTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  users: IUser[]
  inputRef: React.RefObject<HTMLTextAreaElement>
  isMobile: boolean
  activeTab: 'discussions' | 'attachments' | 'editor' | 'sharing'
  setActiveTab: (tab: 'discussions' | 'attachments' | 'editor' | 'sharing') => void
  files: IFile[]
}

const CardContent: React.FC<CardContentProps> = ({
  card,
  projectId,
  title,
  setTitle,
  onTitleChange,
  users,
  inputRef,
  isMobile,
  activeTab,
  setActiveTab,
  files,
}) => {
  return (
    <>
      {isMobile && activeTab === 'sharing' ? (
        <div className='h-[calc(100vh-112px)] bg-white'>
          <ShareTopicContent card={card} onClose={() => setActiveTab('discussions')} />
        </div>
      ) : (
        <>
          {activeTab === 'editor' && isMobile && (
            <div className='h-[calc(100vh_-_90px)] flex-1 hide-scrollbar overflow-y-scroll bg-white overflow-x-hidden z-20 pl-[20px]'>
              <textarea
                ref={inputRef}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  onTitleChange(e)
                }}
                placeholder='Type title'
                rows={1}
                className="max-w-full resize-none focus:outline-none bg-white text-[#46434e] text-[28px] font-medium font-['Rubik']"
                style={{
                  height: `${inputRef.current?.scrollHeight}px`,
                  border: 'none',
                  boxShadow: 'none',
                }}
              />
              <Editor key={card.id} projectId={projectId} card={card} users={users} />
            </div>
          )}
          {activeTab === 'attachments' && <Attachments files={files} />}
          {activeTab === 'discussions' && <Discussions users={users} />}
        </>
      )}
    </>
  )
}

export default CardContent
