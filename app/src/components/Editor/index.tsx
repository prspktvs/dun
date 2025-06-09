import { useEffect, useState } from 'react'
import { SideMenuController, SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/style.css'
// import Mention from '@tiptap/extension-mention'
import { Loader as MantineLoader, Alert } from '@mantine/core'
import * as Y from 'yjs'
import { debounce, get, set } from 'lodash'
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
  filterSuggestionItems,
} from '@blocknote/core'
import firebase from 'firebase/compat/app'
import { HocuspocusProvider } from '@hocuspocus/provider'

import { IUser } from '../../types/User'
import { ICard } from '../../types/Card'
import { CustomSlashMenu, getCustomSlashMenuItems } from './SlashMenu/slashMenuItems'
import suggestion from './Mentions/suggestion'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'
import { useEditor } from '../../context/EditorContext'
import { getWsUrl } from '../../utils/index'
import '@blocknote/mantine/style.css'
import TaskBlock from './Blocks/TaskBlock'
import { uploadFile } from '../../services/upload.service'
import ImageBlock from './Blocks/ImageBlock'
import { Loader } from '../ui/Loader'
import { INITIAL_ONBOARDING_CONTENT } from '../../utils/editor'
import { useProject } from '../../context/ProjectContext'

import { useParams, useSearchParams } from 'react-router-dom'

// import { TaskList } from './Blocks/TaskList'
import { useChats } from '../../context/ChatContext'
import { useHighlightBlock } from '../../hooks/editor/useHighlightBlock'
import { useEditorChats } from '../../hooks/editor/useEditorChats'
import { ROLES } from '../../constants/roles.constants'

const EDITOR_SCHEMA = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    // task: TaskList,
    image: ImageBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
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
console.log('BACKEND_URL', BACKEND_URL)

function useWebRtc(
  id: string,
  onStatus: ({ status }: { status: string }) => void,
  onClose: ({ event }: { event: unknown }) => void,
  user: IUser | firebase.User | null,
  users: IUser[],
  token: string,
) {
  const { isOnboarding } = useProject()
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())

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
    ...(isOnboarding && {
      initialContent: cardId ? INITIAL_ONBOARDING_CONTENT?.[cardId] : [],
    }),
    _tiptapOptions: {
      editable: false,
      extensions: [
        // Mention.configure({
        //   HTMLAttributes: {
        //     class: 'mention',
        //   },
        //   renderText({ options, node }) {
        //     return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
        //   },
        //   suggestion: {
        //     ...suggestion,
        //     items: ({ query }) => {
        //       return (
        //         users?.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase())) ||
        //         []
        //       )
        //     },
        //   },
        // }),
      ],
    },
    collaboration:
      provider && !isOnboarding
        ? {
            provider,
            fragment: doc.getXmlFragment('document-store'),
            user: { name: user.name, color: user.color },
          }
        : undefined,
    schema: EDITOR_SCHEMA,
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
  const { user, token } = useAuth()
  const { hasPermission } = useProject()
  const { setEditor } = useEditor()
  const { openChatById, cardChats, getUnreadMessagesCount } = useChats()

  const canEdit = hasPermission(ROLES.EDITOR)

  const { editor } = useWebRtc(
    `${projectId}/cards/${card.id}`,
    ({ status }) => {
      if (status !== 'connected') return
      setEditable(true)
      setLoading(false)
    },
    ({ event }) => {
      setEditable(false)
    },
    user,
    users,
    token,
  )

  const highlightBlock = useHighlightBlock()

  useEditorChats(editor, { openChatById, cardChats, getUnreadMessagesCount })

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
    if (canEdit) {
      editor.isEditable = editable
      return
    }

    editor.isEditable = false
  }, [editable, canEdit])

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
      </BlockNoteView>
    </>
  )
}

export default Editor
