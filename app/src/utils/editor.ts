import { BlockNoteEditor, BlockSchema, PartialBlock } from '@blocknote/core'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'

import { READ_CHAT_ICON, UNREAD_CHAT_ICON } from '../components/icons'
import { ChatContext } from '../context/ChatContext'

export type ChatIconPluginProps = Pick<
  ChatContext,
  'openChatById' | 'getUnreadMessagesCount' | 'cardChats'
>

export function insertOrUpdateBlock<BSchema extends BlockSchema>(
  editor: BlockNoteEditor<BSchema>,
  block: PartialBlock<BSchema>,
) {
  try {
    const currentBlock = editor?.getTextCursorPosition()?.block
    if (
      (currentBlock?.content?.length === 1 &&
        currentBlock?.content?.[0]?.type === 'text' &&
        currentBlock?.content?.[0]?.text === '/') ||
      currentBlock?.content?.length === 0
    ) {
      editor.updateBlock(currentBlock, block)
    } else {
      editor.insertBlocks([block], currentBlock, 'after')
      editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock!)
    }
  } catch (error) {
    console.error('Error inserting block', error)
  }
}

export const createChatIconPlugin = (key: PluginKey['key'], {
  openChatById,
  getUnreadMessagesCount,
  cardChats,
}: ChatIconPluginProps) =>
  new Plugin({
    key,
    props: {
      decorations: (state) => {
        const decorations: Decoration[] = []

        state.doc.descendants((node, pos) => {
          if (
            !node.type.name.endsWith('blockContainer') ||
            !node.attrs.id ||
            node.content.size <= 2
          ) {
            return
          }

          const blockId = node.attrs.id
          const unreadCount = getUnreadMessagesCount(blockId)
          const hasMessages = cardChats.some((chat) => chat.id === blockId)

          decorations.push(
            Decoration.widget(
              pos + node.nodeSize - 1,
              () => {
                const container = document.createElement('div')
                container.className = 'block-message-icon'

                const iconWrapper = document.createElement('div')
                iconWrapper.style.cssText = `
                  position: relative;
                  width: 20px;
                  height: 20px;
                  opacity: ${unreadCount > 0 ? '1' : hasMessages ? '0.6' : '0'};
                  transition: opacity 0.2s ease;
                `

                iconWrapper.innerHTML = unreadCount > 0 ? UNREAD_CHAT_ICON : READ_CHAT_ICON

                const blockElement = document.querySelector(`[data-id="${blockId}"]`)
              
                if (blockElement) {
                  blockElement.addEventListener('mouseenter', () => {
                    if (!hasMessages && !unreadCount) {
                      iconWrapper.style.opacity = '0.6'
                    }
                  })

                  blockElement.addEventListener('mouseleave', () => {
                    if (!hasMessages && !unreadCount) {
                      iconWrapper.style.opacity = '0'
                    }
                  })
                }

                if (unreadCount > 0) {
                  const badge = document.createElement('div')
                  badge.textContent = unreadCount > 99 ? '99+' : String(unreadCount)
                  badge.style.cssText = `
                    position: absolute;
                    top: 3px;
                    right: -3px;
                    color: black;
                    font-size: 10px;
                    font-weight: 500;
                    min-width: 20px;
                    height: 14px;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 3px;
                  `
                  iconWrapper.appendChild(badge)
                }

                container.appendChild(iconWrapper)
                container.style.cssText = `
                  position: absolute;
                  right: -20px;
                  top: 6px;
                  transform: translateY(-50%);
                  cursor: pointer;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 1;
                `

                container.addEventListener('click', (e) => {
                  e.stopPropagation()
                  openChatById(blockId)
                })

                return container
              },
              { key: `message-${node.attrs.id}` },
            ),
          )
        })

        return DecorationSet.create(state.doc, decorations)
      },
    },
  })