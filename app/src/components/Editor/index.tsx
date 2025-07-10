import { useCallback, useEffect, useState } from 'react'
import { SideMenuController, SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/style.css'
import { Loader as MantineLoader, Alert } from '@mantine/core'
import * as Y from 'yjs'
import { debounce } from 'lodash'
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  filterSuggestionItems,
} from '@blocknote/core'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { useParams, useSearchParams } from 'react-router-dom'

import { IUser } from '../../types/User'
import { ICard } from '../../types/Card'
import { getCustomSlashMenuItems } from './SlashMenu/slashMenuItems'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'
import { useEditor } from '../../context/EditorContext'
import { getWsUrl } from '../../utils/index'
import '@blocknote/mantine/style.css'
import { uploadFile } from '../../services/upload.service'
import ImageBlock from './Blocks/ImageBlock'
import { Loader } from '../ui/Loader'
import { useProject } from '../../context/ProjectContext'
import { TaskList } from './Blocks/TaskList'
import { useChats } from '../../context/ChatContext'
import { ONBOARDING_EDITOR_ID, ROLES } from '../../constants/roles.constants'
import { Mention } from './Mentions/Mention'
import { getMentionMenuItems } from './SlashMenu/MentionMenu'
import { HighlightBlockExtension } from './Extensions/HighlightBlock'
import { ChatIconExtension } from './Extensions/ChatIcon'

const EDITOR_SCHEMA = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    task: TaskList,
    image: ImageBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
})

const SAVING_DELAY = 2000

interface IEditorProps {
  card: ICard
  users: IUser[]
}

const BACKEND_URL = getWsUrl(process.env.VITE_BACKEND_URL || '')

function useCreateCollaborationEditor(
  id: string,
  onStatus: ({ status }: { status: string }) => void,
  onClose: ({ event }: { event: unknown }) => void,
) {
  const { isOnboarding } = useProject()
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())
  const { user, token } = useAuth()
  const { openChatById, getUnreadMessagesCount, cardChats } = useChats()

  const [provider, setProvider] = useState(
    () =>
      new HocuspocusProvider({
        url: `${BACKEND_URL}/collaboration`,
        token: token,
        name: id,
        broadcast: true,
        document: doc,
        onStatus,
        onClose,
      }),
  )

  const cardId = id.split('/').pop()
  const editor = useCreateBlockNote({
    collaboration: provider
      ? {
          provider,
          fragment: doc.getXmlFragment('document-store'),
          user: { name: user.name, color: user.color },
        }
      : undefined,
    schema: EDITOR_SCHEMA,
    _tiptapOptions: {
      extensions: [
        HighlightBlockExtension.configure({
          duration: 3000,
          color: 'rgba(255, 255, 0, 0.3)',
          behavior: 'smooth',
        }),
        ChatIconExtension.configure({
          openChatById,
          getUnreadMessagesCount,
          cardChats,
        }),
      ],
    },
    uploadFile,
  })

  return { provider, doc, editor }
}

function Editor({ card, users }: IEditorProps) {
  const { id: projectId } = useParams()
  const [searchParams] = useSearchParams()
  const [isLoading, setLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { hasPermission, isOnboarding } = useProject()
  const { user } = useAuth()
  const { setEditor } = useEditor()
  const { openChatById, cardChats, getUnreadMessagesCount } = useChats()

  const canEdit = hasPermission(ROLES.EDITOR)

  const { editor } = useCreateCollaborationEditor(
    `${projectId}/cards/${card.id}`,
    ({ status }) => {
      if (status !== 'connected') return
      setEditable(true)
      setLoading(false)
    },
    ({ event }) => {
      setEditable(false)
    },
  )

  const highlightBlock = useCallback(
    (blockId: string) => {
      if (editor && blockId) {
        editor._tiptapEditor.commands.highlightBlock(blockId)
      }
    },
    [editor],
  )

  useEffect(() => {
    if (editor && editor._tiptapEditor && !editor._tiptapEditor.isDestroyed) {
      editor._tiptapEditor.extensionStorage.chatIcon = {
        openChatById,
        cardChats,
        getUnreadMessagesCount,
      }

      try {
        editor._tiptapEditor.commands.updateChatIcons()
      } catch (error) {
        console.error('Failed to update chat icons on change:', error)
      }
    }
  }, [editor, openChatById, cardChats, getUnreadMessagesCount])

  useEffect(() => {
    const taskId = searchParams.get('taskId')
    const chatId = location.pathname.includes('/chats/')
      ? location.pathname.split('/chats/').pop()
      : null

    if (!isLoading && editable) {
      if (taskId) {
        setTimeout(() => highlightBlock(taskId), 100)
      } else if (chatId && card.chatIds?.includes(chatId)) {
        setTimeout(() => highlightBlock(chatId), 100)
      }
    }
  }, [editor, searchParams, location.pathname, isLoading, editable, highlightBlock, card.chatIds])

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    setEditor(editor as BlockNoteEditor)
  }, [editor])

  useEffect(() => {
    if (isOnboarding) {
      const isAllowedOnboardingUser = user?.id === ONBOARDING_EDITOR_ID
      editor.isEditable = isAllowedOnboardingUser
      return
    }

    if (canEdit) {
      editor.isEditable = editable
      return
    }

    editor.isEditable = false
  }, [editable, canEdit])

  const onDebouncedSave = debounce(async (editor) => {
    console.log('onDebounceSave editor.topLevelBlocks', editor.topLevelBlocks, 'editor', editor)
  }, SAVING_DELAY)

  useEffect(() => {
    return () => onDebouncedSave.cancel()
  }, [onDebouncedSave])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {!isOnline && (
        <Alert
          variant='light'
          color='red'
          title='No Internet Connection'
          icon={<i className='ri-wifi-off-line' />}
          className='mb-2'
        >
          You're offline. Your changes may not be saved.
        </Alert>
      )}
      {!editable && (
        <Alert variant='light' color='red' title='' icon={<MantineLoader color='red' size={20} />}>
          Loading...
        </Alert>
      )}
      <BlockNoteView editor={editor} theme='light' sideMenu={false} slashMenu={false}>
        <SideMenuController sideMenu={CustomSideMenu} />
        <SuggestionMenuController
          triggerCharacter='/'
          getItems={async (query) => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
        />
        <SuggestionMenuController
          triggerCharacter={'@'}
          getItems={async (query) =>
            filterSuggestionItems(getMentionMenuItems(editor, users), query)
          }
        />
      </BlockNoteView>
    </>
  )
}

export default Editor
