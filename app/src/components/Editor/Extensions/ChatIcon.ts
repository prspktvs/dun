import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { READ_CHAT_ICON, UNREAD_CHAT_ICON } from '../../icons'

export interface ChatIconExtensionOptions {
  openChatById: (blockId: string) => void
  getUnreadMessagesCount: (blockId: string) => number
  cardChats: Array<{ id: string }>
  readChatIcon?: string
  unreadChatIcon?: string
}

const CHAT_ICON_PLUGIN_KEY = new PluginKey('chat-icon-plugin')

export const ChatIconExtension = Extension.create<ChatIconExtensionOptions>({
  name: 'chatIcon',

  addOptions() {
    return {
      openChatById: () => {},
      getUnreadMessagesCount: () => 0,
      cardChats: [],
      readChatIcon: READ_CHAT_ICON,
      unreadChatIcon: UNREAD_CHAT_ICON,
    }
  },

  onUpdate() {
    return ({ editor }) => {
      const storage = editor.extensionStorage.chatIcon
      if (storage) {
        this.options.openChatById = storage.openChatById || this.options.openChatById
        this.options.getUnreadMessagesCount = storage.getUnreadMessagesCount || this.options.getUnreadMessagesCount
        this.options.cardChats = storage.cardChats || this.options.cardChats
      }
    }
  },

  addProseMirrorPlugins() {
    const { openChatById, getUnreadMessagesCount, cardChats, readChatIcon, unreadChatIcon } = this.options

    const unreadCountCache: Record<string, number> = {}
    let lastCardChatsJSON = JSON.stringify(cardChats)

    return [
      new Plugin({
        key: CHAT_ICON_PLUGIN_KEY,
        
        view(view) {
          let timeout: NodeJS.Timeout | null = null
          
          const checkForUpdates = () => {
            let hasChanges = false
            
            const currentCardChatsJSON = JSON.stringify(cardChats)
            if (lastCardChatsJSON !== currentCardChatsJSON) {
              lastCardChatsJSON = currentCardChatsJSON
              hasChanges = true
            }
            
            view.state.doc.descendants((node, pos) => {
              if (!node.attrs?.id) return
              
              const blockId = node.attrs.id
              const newCount = getUnreadMessagesCount(blockId)
              
              if (unreadCountCache[blockId] !== newCount) {
                unreadCountCache[blockId] = newCount
                hasChanges = true
              }
            })
            
            if (hasChanges) {
              view.dispatch(view.state.tr.setMeta(CHAT_ICON_PLUGIN_KEY, { forceUpdate: true }))
            }
            
            timeout = setTimeout(checkForUpdates, 1000)
          }
          
          timeout = setTimeout(checkForUpdates, 500)
          
          return {
            destroy() {
              if (timeout) clearTimeout(timeout)
            }
          }
        },
        
        state: {
          init() {
            return {
              lastUpdate: Date.now(),
              decorationsVersion: 0,
              forceUpdateCounter: 0
            }
          },
          apply(tr, value, oldState, newState) {
            const forceUpdate = tr.getMeta(CHAT_ICON_PLUGIN_KEY)?.forceUpdate
            
            if (forceUpdate) {
              return {
                ...value,
                lastUpdate: Date.now(),
                decorationsVersion: value.decorationsVersion + 1,
                forceUpdateCounter: value.forceUpdateCounter + 1
              }
            }
            
            return value
          }
        },
        
        props: {
          decorations: (state) => {
            const pluginState = CHAT_ICON_PLUGIN_KEY.getState(state)
            const decorations: Decoration[] = []

            const storage = state?.tr?.docView?.editor?.extensionStorage?.chatIcon
              || (window as any).editor?._tiptapEditor?.extensionStorage?.chatIcon
              || this.options

            const openChatById = storage.openChatById
            const getUnreadMessagesCount = storage.getUnreadMessagesCount
            const cardChats = storage.cardChats
            const unreadChatIcon = storage.unreadChatIcon ?? UNREAD_CHAT_ICON
            const readChatIcon = storage.readChatIcon ?? READ_CHAT_ICON

            const doc = state.doc

            doc.descendants((node, pos) => {
              if (!node.attrs?.id) return
              if (node.type.name !== 'blockContainer') return

              const blockId = node.attrs.id
              const unreadCount = getUnreadMessagesCount(blockId)
              const hasMessages = cardChats.some((chat) => chat.id === blockId)

              if (hasMessages) {
                decorations.push(
                  Decoration.widget(
                    pos + 1,
                    () => {
                      const container = document.createElement('div')
                      container.className = 'chat-icon-container'
                      container.dataset.blockId = blockId

                      container.style.cssText = `
                        position: absolute;
                        right: -20px;
                        top: 10px;
                        transform: translateY(-50%);
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        z-index: 20;
                        pointer-events: all;
                      `

                      const iconWrapper = document.createElement('div')
                      iconWrapper.style.cssText = `
                        position: relative;
                        width: 20px;
                        height: 20px;
                        opacity: 1;
                        transition: opacity 0.3s ease;
                      `
                      iconWrapper.innerHTML = unreadCount > 0 ? unreadChatIcon : readChatIcon

                      if (unreadCount > 0) {
                        const badge = document.createElement('div')
                        badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount)
                        badge.style.cssText = `
                          position: absolute;
                          top: 1px;
                          right: -2px;
                          color: black;
                          font-size: 12px;
                          font-weight: 500;
                          width: 100%;
                          height: 16px;
                          border-radius: 8px;
                          display: flex;
                          text-align: center;
                          align-items: center;
                          justify-content: center;
                          padding: 0 3px;
                          box-sizing: border-box;
                        `
                        iconWrapper.appendChild(badge)
                      }

                      container.appendChild(iconWrapper)
                      container.addEventListener('click', (e) => {
                        e.stopPropagation()
                        openChatById(blockId)
                      })

                      return container
                    },
                    { key: `chat-icon-${node.attrs.id}-${pluginState.decorationsVersion}` },
                  ),
                )
              } else {
                decorations.push(
                  Decoration.widget(
                    pos + 1,
                    () => {
                      const container = document.createElement('div')
                      container.className = 'chat-icon-container chat-icon-hover-only'
                      container.dataset.blockId = blockId

                      container.style.cssText = `
                        position: absolute;
                        right: -20px;
                        top: 10px;
                        transform: translateY(-50%);
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        z-index: 20;
                        pointer-events: all;
                        opacity: 0;
                        transition: opacity 0.2s;
                      `

                      container.addEventListener('mouseenter', () => {
                        container.style.opacity = '1'
                      })
                      container.addEventListener('mouseleave', () => {
                        container.style.opacity = '0'
                      })

                      const iconWrapper = document.createElement('div')
                      iconWrapper.style.cssText = `
                        position: relative;
                        width: 20px;
                        height: 20px;
                        opacity: 1;
                        transition: opacity 0.3s ease;
                      `
                      iconWrapper.innerHTML = readChatIcon

                      container.appendChild(iconWrapper)
                      container.addEventListener('click', (e) => {
                        e.stopPropagation()
                        openChatById(blockId)
                      })

                      return container
                    },
                    { key: `chat-icon-hover-${node.attrs.id}-${pluginState.decorationsVersion}` },
                  ),
                )
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },

  addCommands() {
    return {
      updateChatIcons: () => ({ editor, state, dispatch }) => {
        try {
          const storage = editor?.extensionStorage?.chatIcon
          if (storage) {
            this.options.openChatById = storage.openChatById || this.options.openChatById
            this.options.getUnreadMessagesCount = storage.getUnreadMessagesCount || this.options.getUnreadMessagesCount
            this.options.cardChats = storage.cardChats || this.options.cardChats
          }

          if (!state || !dispatch) {
            console.warn('Missing state or dispatch to update chat icons')
            return false
          }
          
          const tr = state.tr.setMeta(CHAT_ICON_PLUGIN_KEY, { forceUpdate: true })
          dispatch(tr)
          
          return true
        } catch (error) {
          console.error('Error updating chat icons:', error)
          return false
        }
      }
    }
  }
})