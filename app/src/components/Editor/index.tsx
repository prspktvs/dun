import { useEffect, useState, useRef } from 'react'
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  blockTypeSelectItems,
  FileCaptionButton,
  FormattingToolbar,
  FormattingToolbarController,
  SideMenuController,
  SuggestionMenuController,
  TextAlignButton,
  useCreateBlockNote,
} from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/style.css'
import Mention from '@tiptap/extension-mention'
import suggestion from './Mentions/suggestion'
import { CustomSlashMenu, getCustomSlashMenuItems } from './SlashMenu/slashMenuItems'
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
import { ICard } from '../../types/Card'
import { IUser } from '../../types/User'
import firebase from 'firebase/compat/app'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { Alert, Loader } from '@mantine/core'
import { useAuth } from '../../context/AuthContext'
import CustomSideMenu from './SideMenu'
import { useChats } from '../../context/ChatContext'
import { useEditor } from '../../context/EditorContext'
import { getWsUrl } from '../../utils/index'
import '@blocknote/mantine/style.css'
import TaskBlock from './Blocks/TaskBlock'
import { uploadFile } from '../../services/upload.service'
import ImageBlock from './Blocks/ImageBlock'

const schema = BlockNoteSchema.create({
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
  projectId: string
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
  // const lastId = useRef<string>(id)
  const [doc, setDoc] = useState<Y.Doc>(new Y.Doc())

  const [provider, setProvider] = useState(
    () =>
      new HocuspocusProvider({
        url: `${BACKEND_URL}/collaboration`,
        token: token,
        name: id,
        document: doc,
        onStatus,
        onClose,
      }),
  )
  // console.log('useWebRtc', provider)

  const editor = useCreateBlockNote({
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
    // onEditorContentChange: (editor) => onDebouncedSave(editor),
    collaboration: provider
      ? {
          provider,
          fragment: doc.getXmlFragment('document-store'),
          user: { name: user.name, color: user.color },
        }
      : undefined,
    schema,
    uploadFile,
  })

  return { provider, doc, editor }
}

function Editor({ projectId, card, users }: IEditorProps) {
  const [isLoading, setLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const { user, token } = useAuth()
  const { chatId } = useChats()
  const { setEditor } = useEditor()
  const { provider, doc, editor } = useWebRtc(
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
    <div className='flex justify-center items-center h-full w-full'>
      <Loader />
    </div>
  ) : (
    <>
      {!editable && (
        <Alert variant='light' color='red' title='' icon={<Loader color='red' size={20} />}>
          Loading...
        </Alert>
      )}
      <BlockNoteView editor={editor} theme='light' sideMenu={false} slashMenu={false}>
        {/* <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar
              blockTypeSelectItems={[
                {
                  name: 'paragraph',
                  type: 'paragraph',
                  isSelected: () => false,
                  icon: undefined,
                },
              ]}
            >
              <BlockTypeSelect key={'blockTypeSelect'} />

              <BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
              <BasicTextStyleButton basicTextStyle={'italic'} key={'italicStyleButton'} />
              <BasicTextStyleButton basicTextStyle={'underline'} key={'underlineStyleButton'} />
              <BasicTextStyleButton basicTextStyle={'strike'} key={'strikeStyleButton'} />
              <BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />

              <TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
              <TextAlignButton textAlignment={'center'} key={'textAlignCenterButton'} />
              <TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />
            </FormattingToolbar>
          )}
        /> */}
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
