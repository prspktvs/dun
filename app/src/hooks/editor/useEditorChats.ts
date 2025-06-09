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
        const currentPlugins = editor.prosemirrorView.state.plugins
        const otherPlugins = currentPlugins.filter(
          (p) => p.key !== MESSAGE_ICON_PLUGIN_KEY.key,
        )
        
        const newState = editor.prosemirrorView.state.reconfigure({
          plugins: [...otherPlugins, messageIconPlugin],
        })
        
        // Directly update the editor's state with the new configuration.
        // This avoids dispatching a separate transaction that might interfere with history.
        editor.prosemirrorView.updateState(newState)

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

        }
      } catch (error) {
        console.error('Error removing plugin:', error)
      }
    }
  }, [messageIconPlugin, cardChats.length, updateKey])
}
