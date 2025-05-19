import { useEffect, useState } from 'react'
import { SideMenuController, SuggestionMenuController, useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/style.css'
import Mention from '@tiptap/extension-mention'
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
import firebase from 'firebase/compat/app'
import { HocuspocusProvider } from '@hocuspocus/provider'

import { IUser } from '../../types/User'
import { ICard } from '../../types/Card'
import { CustomSlashMenu, getCustomSlashMenuItems } from './SlashMenu/slashMenuItems'
import suggestion from './Mentions/suggestion'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'
import { useChats } from '../../context/ChatContext'
import { useEditor } from '../../context/EditorContext'
import { getWsUrl } from '../../utils/index'
import '@blocknote/mantine/style.css'
import TaskBlock from './Blocks/TaskBlock'
import { uploadFile } from '../../services/upload.service'
import ImageBlock from './Blocks/ImageBlock'
import { Loader } from '../ui/Loader'
import { INITIAL_ONBOARDING_CONTENT } from '../../utils/editor'
import { useProject } from '../../context/ProjectContext'

import { useParams } from 'react-router-dom'

const EDITOR_SCHEMA = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    image: ImageBlock,
    task: TaskBlock,
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
  // console.log('useWebRtc', provider)
  const cardId = id.split('/').pop()
  const editor = useCreateBlockNote({
    initialContent: cardId ? INITIAL_ONBOARDING_CONTENT?.[cardId] : [],
    _tiptapOptions: {
      editable: false,
      extensions: [
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          renderText({ options, node }) {
            return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
          },
          suggestion: {
            ...suggestion,
            items: ({ query }) => {
              return (
                users?.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase())) ||
                []
              )
            },
          },
        }),
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
  const [isLoading, setLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { user, token } = useAuth()

  const { setEditor } = useEditor()

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
  console.log('blocks', editor.document)

  useEffect(() => {
    setEditor(editor as BlockNoteEditor)
  }, [editor])

  useEffect(() => {
    editor.isEditable = editable
  }, [editable])

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
          suggestionMenuComponent={CustomSlashMenu}
          getItems={async (query) => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
        />
      </BlockNoteView>
    </>
  )
}

export default Editor
