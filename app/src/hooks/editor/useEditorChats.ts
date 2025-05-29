import { BlockNoteEditor } from '@blocknote/core'
import { useEffect, useMemo, useRef } from 'react'
import {  PluginKey } from 'prosemirror-state'

import { ChatIconPluginProps, createChatIconPlugin } from '../../utils/editor'

const MESSAGE_ICON_PLUGIN_KEY = new PluginKey('message-icon-plugin')

export const useEditorChats = (
  editor: BlockNoteEditor,
  { openChatById, getUnreadMessagesCount, cardChats }: ChatIconPluginProps,
) => {
  const previousChatsRef = useRef<typeof cardChats>([])

  const unreadCountsMap = useMemo(() => {
    const map = new Map<string, number>()
    cardChats.forEach((chat) => {
      map.set(chat.id, getUnreadMessagesCount(chat.id))
    })
    return map
  }, [cardChats, getUnreadMessagesCount])

  const updateKey = useMemo(() => {
    const hasChanges = cardChats.some((chat) => {
      const prevChat = previousChatsRef.current.find((c) => c.id === chat.id)
      return !prevChat || getUnreadMessagesCount(chat.id) !== getUnreadMessagesCount(prevChat.id)
    })

    if (hasChanges) {
      previousChatsRef.current = cardChats
      return Date.now()
    }

    return null
  }, [cardChats, unreadCountsMap])

  const messageIconPlugin = useMemo(
    () =>
      createChatIconPlugin(MESSAGE_ICON_PLUGIN_KEY,{
        openChatById,
        getUnreadMessagesCount,
        cardChats,
      }),
    [openChatById, updateKey],
  )

  useEffect(() => {
    const initPlugin = () => {
      if (!editor?.prosemirrorView?.state) {
        console.log('Waiting for editor initialization...')
        setTimeout(initPlugin, 100)
        return
      }

      try {
        const plugins = editor.prosemirrorView.state.plugins.filter(
          (p) => p.key !== MESSAGE_ICON_PLUGIN_KEY.key,
        )

        editor.prosemirrorView.updateState(
          editor.prosemirrorView.state.reconfigure({
            plugins: [...plugins, messageIconPlugin],
          }),
        )

        const tr = editor.prosemirrorView.state.tr
        editor.prosemirrorView.dispatch(tr.setMeta('forceUpdate', true))
      } catch (error) {
        console.error('Error updating message plugin:', error)
      }
    }

    if (editor) {
      initPlugin()
    }

    return () => {
      try {
        if (editor?.prosemirrorView?.state) {
          const plugins = editor.prosemirrorView.state.plugins.filter(
            (p) => p.key !== MESSAGE_ICON_PLUGIN_KEY.key,
          )
          editor.prosemirrorView.updateState(editor.prosemirrorView.state.reconfigure({ plugins }))
          console.log('Message plugin removed')
        }
      } catch (error) {
        console.error('Error removing plugin:', error)
      }
    }
  }, [editor, messageIconPlugin, cardChats.length, updateKey])
}
