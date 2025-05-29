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

                // Set icon based on whether there are unread messages
                iconWrapper.innerHTML = unreadCount > 0 ? UNREAD_CHAT_ICON : READ_CHAT_ICON

                const blockElement = document.querySelector(`[data-id="${blockId}"]`)
              
                if (blockElement) {
                  blockElement.addEventListener('mouseenter', () => {
                    // Show icon on hover only for blocks without messages
                    if (!hasMessages && !unreadCount) {
                      iconWrapper.style.opacity = '0.6'
                    }
                  })

                  blockElement.addEventListener('mouseleave', () => {
                    // Hide icon on mouse leave only for blocks without messages
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

export const INITIAL_ONBOARDING_CONTENT = {
  E0aApBZWVJTbtUaiwHLj: [
    {
      id: '951434c3-86e9-4dcb-aef0-14e75a436c73',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Topic contains:',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'c028bd47-7059-4fbf-b1e9-c9ad168e7528',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to create new project',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '79c4a4c2-7f10-4875-9499-116bf2f5c2e9',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to edit project',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '78c0c863-44a8-4893-93c5-a2164136310e',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to invite your team ',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '5b1bcc48-8308-4e1b-a9c0-f69553fdb497',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '53b66d0e-863e-41a4-be89-adced8e4d281',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '1. How to create new project',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '80bc71c1-365d-4429-b0ae-48e6988e68c9',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'image.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1747280140571.png?alt=media&token=6c89a503-5edb-447c-9dec-f50f1e5ddad9',
        caption: '',
        showPreview: true,
        previewWidth: 602,
      },
      children: [],
    },
    {
      id: '30db65fc-cef8-46d7-a82c-cbdfa0309b6e',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '567595c3-d908-4ae7-a2dc-604ae5fe2614',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '2. How to edit project',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'c1f4676b-1b6c-4db4-8a91-f7af2a6b17a7',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'You can open project settings from the Project dropdown or the left sidebar',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '5d8c0e1a-1450-4585-a094-96bce796d6bd',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'image.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1747280927345.png?alt=media&token=89c1c3bb-9768-49b4-be6e-0a42c97fafc5',
        caption: '',
        showPreview: true,
        previewWidth: 605,
      },
      children: [],
    },
    {
      id: 'd47fd6a4-d5a5-4951-8785-8bcee9a2b7fc',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '535ff2fd-a94e-4936-adad-48b6afb9acb0',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '3. How to invite your team ',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '84d4189f-5b33-4f70-ad96-b1582d09f318',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Copy the link from the address bar or project settings',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '71fec327-103a-40d8-bf75-66b3dea7c3e4',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'image.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1747280054268.png?alt=media&token=c365380c-12b9-4ee1-aa2c-4f1be680007a',
        caption: '',
        showPreview: true,
        previewWidth: 602,
      },
      children: [],
    },
    {
      id: '1f639f6e-f0bd-4a69-acc8-06a3fc1b0d26',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '577b090c-1b75-4fd8-af50-13be4a7c9f3f',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'e1c48aae-0878-4a3b-965c-9f15652e0ba3',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
  ],
  m0wkAckpcs1Rx4V6y3HV: [
    {
      id: '3cb38365-1bf4-481d-baec-75ecb20f5873',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Topic contains:',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'f4a95ff2-225c-467b-8128-f2ead87b0436',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to create tasks',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '975f81ba-87da-4a9e-a0e6-14525612f387',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to assign tasks',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '2df4ab3e-80f3-451e-98bb-02b6d6a6157b',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to add a description linked to the task container',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '12fac801-f482-4889-9d85-a98e2a4ce746',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to start a discussion about the task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'e40fd2fd-240d-4887-89cd-7a40123805d4',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'How to prioritize tasks and add a status',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '82ad71ed-11f4-4374-92ac-8025a071bbf0',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'd61a6add-cef2-4409-bf7a-2d5d1d632c34',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'f574b842-42e7-4b4f-8168-ba7bb18380b2',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '1. How to create tasks',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'a2d200e7-0953-43e4-8160-0428cbaea7a2',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Use ',
          styles: {},
        },
        {
          type: 'text',
          text: ' //  ',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: 'as a shortcut to create a new task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '9e69de61-af06-4e01-9807-04734cb26779',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Or type',
          styles: {},
        },
        {
          type: 'text',
          text: ' ',
          styles: {
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: '/',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' ',
          styles: {
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: "and find 'Task'",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '8f8eb04f-4ca6-436f-8bcf-d7d2781f0182',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'cbfb78a5-9458-49d1-9efa-6d7416c4c289',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'initialBlockId',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '2. How to Assign Tasks',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'bc07ff47-3925-4bb9-897f-ab0cbe018186',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Just type ',
          styles: {},
        },
        {
          type: 'text',
          text: '@',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' anywhere in the task container to assign a task to yourself or a teammate',
          styles: {},
        },
      ],
      children: [
        {
          id: '5605b716-cea1-4a6d-b147-a9b8d44b9059',
          type: 'image',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: 'image.png',
            url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1745493931360.png?alt=media&token=f8847de0-f29d-4e13-a4a5-65e92fad7d25',
            caption: '',
            showPreview: true,
            previewWidth: 512,
          },
          children: [],
        },
        {
          id: 'b8790689-3cec-4381-9e47-c99f9f03d3aa',
          type: 'task',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
            title: '',
            isDone: true,
            status: 'Dun',
            priority: 'Urgent',
            author: 'm73CYbjf2VVgZ8j20fndfj9h4Te2',
            users: [],
          },
          content: [
            {
              type: 'text',
              text: ' prepare onboarding content ',
              styles: {},
            },
          ],
          children: [],
        },
      ],
    },
    {
      id: '5d5eb6fb-f599-4efd-9e94-1fd07aa377e4',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'c22a4045-3e9c-43f4-8f59-e2d3ed90bfc4',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'The person you assign will get a push notification, and the task will show up in their left bar',
          styles: {},
        },
      ],
      children: [
        {
          id: '07b8fd19-0973-4064-a227-1a148e8901a2',
          type: 'image',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: 'image.png',
            url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1745494226882.png?alt=media&token=07da4da6-5010-4334-b1c4-a366d651cc85',
            caption: '',
            showPreview: true,
            previewWidth: 379,
          },
          children: [],
        },
      ],
    },
    {
      id: '8a38eca9-a139-492f-91c4-e1c7fcf90fc2',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'c1cb2831-d602-425a-b6f8-a3a62869dcc7',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '1c8ec3d4-b556-4874-b432-bf4eeb631954',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '3. How to Add a Description Linked to the Task Container',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '06540cce-4977-40b9-b6d0-f5c388a35de2',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Create a new task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '8015cf15-ccc9-412e-b46e-9b3c1612d8db',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Use ',
          styles: {},
        },
        {
          type: 'text',
          text: 'Tab',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' on the next line to add any content',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '767a55e9-88d3-431f-a131-5335ac744a41',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '4fb62c59-499d-41f7-af36-1dfaa2f523de',
      type: 'task',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        title: '',
        isDone: false,
        status: 'no status',
        priority: 'no priority',
        author: 'm73CYbjf2VVgZ8j20fndfj9h4Te2',
        users: [],
      },
      content: [
        {
          type: 'text',
          text: 'Prepare onboarding content',
          styles: {},
        },
      ],
      children: [
        {
          id: '86fd8d61-a85c-45ba-a73a-d1150e149829',
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Design ',
              styles: {},
            },
            {
              type: 'link',
              href: 'https://images.unsplash.com/photo-1671372489089-01947862703e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              content: [
                {
                  type: 'text',
                  text: 'reference',
                  styles: {},
                },
              ],
            },
            {
              type: 'text',
              text: ': use our branding colors and typography',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: '296acc88-c0db-4b61-89e5-78fc6b354afa',
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'One more reference:',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: '06355b86-df5a-4be4-97a2-699642fc49b8',
          type: 'image',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: '',
            url: 'https://images.unsplash.com/photo-1671372489089-01947862703e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            caption: '',
            showPreview: true,
            previewWidth: 226,
          },
          children: [],
        },
      ],
    },
    {
      id: 'f8897ee6-2e42-4c97-b5a1-527981b20d3c',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '332899b7-b264-40d2-a468-23872738972d',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Now, if you drag and drop the task up or down, the description will stay attached and move together with the task container ',
          styles: {},
        },
      ],
      children: [
        {
          id: 'fd016daa-f766-44c1-9ce3-9d03785c474c',
          type: 'image',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: 'image.png',
            url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1745494966214.png?alt=media&token=123f5dd0-78f6-444a-82d1-04f173bef33f',
            caption: '',
            showPreview: true,
            previewWidth: 379,
          },
          children: [],
        },
      ],
    },
    {
      id: '8b8ae14e-f859-432b-a7cd-67af7ca1b9d6',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'ca9234e2-9016-4643-bb60-37245ea4c90d',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '2b2e9c00-d540-43e9-b51a-16dd8a79a85f',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '4. How to Start a Discussion About the Task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'dbd1eb74-125c-45d1-80d2-38917f3f5db8',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tap the Discussion icon in the task’s line settings on the left',
          styles: {},
        },
      ],
      children: [
        {
          id: '2d2fc5c6-05e8-4635-88ff-aed6194d4b10',
          type: 'image',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: 'image.png',
            url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1745495091307.png?alt=media&token=b54ba881-ca89-4879-a8dd-a3f175e8ac9a',
            caption: '',
            showPreview: true,
            previewWidth: 642,
          },
          children: [],
        },
      ],
    },
    {
      id: 'adb9ed2a-ab48-4f1b-810d-80997d9b8b91',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '5a3993da-6beb-4e5e-bb68-fb1af5940c6d',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '5457f9de-89ff-4770-bfa0-4c1f8d84e86f',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '5. How to prioritize tasks and add a status',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '592da41c-1b06-44bc-8b8a-b9c9e4425b83',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Create new task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'a62091b9-75f9-49d0-a78c-3844f24da9e3',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tap the line again and select a priority and status, if needed',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'ec9348cb-feaa-4219-9e7c-93a45ae180e4',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: "Tap again if you don't need it or if it's disturbing you while typing",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '847de1a5-a670-4650-b840-38e5f3058bdd',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'e66bb70d-7fca-4b8b-9078-08ea7dadbed1',
      type: 'task',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        title: '',
        isDone: false,
        status: 'In progress',
        priority: 'Urgent',
        author: 'm73CYbjf2VVgZ8j20fndfj9h4Te2',
        users: [],
      },
      content: [
        {
          type: 'text',
          text: 'I want to be first!',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'c281c7e8-dd61-4b28-bf75-259e0cc5f84f',
      type: 'task',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        title: '',
        isDone: false,
        status: 'no status',
        priority: 'Low',
        author: 'm73CYbjf2VVgZ8j20fndfj9h4Te2',
        users: [],
      },
      content: [
        {
          type: 'text',
          text: "I'm not necessary one, check me later please :)",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'add60315-c7df-44b6-a42d-e5b14c92c4fd',
      type: 'task',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        title: '',
        isDone: false,
        status: 'no status',
        priority: 'no priority',
        author: 'm73CYbjf2VVgZ8j20fndfj9h4Te2',
        users: [],
      },
      content: [
        {
          type: 'text',
          text: 'Try on me',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '672eaadb-2c67-4d3a-9de5-42e03bff45db',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
  ],
  '2KXvq2OJIpUjBLBjxFzU': [
    {
      id: 'd15d6dfb-03ce-4ed9-bd42-c85135a49454',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Topic contains:',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'a9868729-4a58-48f1-886b-1b51c7b3c5a0',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Sharing settings',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'e448ec20-8112-486b-8a6a-cc7753582711',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Editor',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'ec5dc253-8594-4081-8128-3bc9149d9ca7',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Discussions',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'fd72ca5f-7e62-46be-9942-b75474504d62',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Attachements',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'a2fd8fd8-ecd5-4d71-bfbf-7f40e86183b0',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'fc85149b-7316-4ca1-a329-74203ed75800',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '1. Sharing settings',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '96e41f90-946f-432e-b076-e6527094bf92',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Private:',
          styles: {
            bold: true,
          },
        },
        {
          type: 'text',
          text: ' Use a private topic for yourself or share it with your team. You can revoke access from users at any time',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '97145583-ab97-4266-b921-a4eb5f6f753c',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Public:',
          styles: {
            bold: true,
          },
        },
        {
          type: 'text',
          text: ' Public topics are visible to all project members, including new ones.\nYou can switch a public topic back to private at any time.',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '8945520c-6f66-456b-aafe-0282d1e0f7cb',
      type: 'image',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'image.png',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/images%2Fimage_1747282053270.png?alt=media&token=5f267673-0a85-4e05-9209-b87586e8106c',
        caption: '',
        showPreview: true,
        previewWidth: 621,
      },
      children: [],
    },
    {
      id: '8e78098d-6efd-48cc-8238-caf96f73346b',
      type: 'video',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'Screen Recording 2025-05-15 at 7.08.42 AM.mov',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/videos%2Fvideo_1747282501508.quicktime?alt=media&token=527d16e4-b88f-44f0-8c21-3152a1d9d5d0',
        caption: '',
        showPreview: true,
        previewWidth: 619,
      },
      children: [],
    },
    {
      id: '8b0c443a-ce3a-4ebe-9df4-fe473cf6b293',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '3d973be6-49d8-4408-a79b-82e7069a8f55',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '2. Editor',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'c7b242ba-fe00-4301-8d81-de5775c7fe4a',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Type ',
          styles: {},
        },
        {
          type: 'text',
          text: ' / ',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' to access commands in the editor',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'bf3f2708-b534-4ab3-ae3b-433a12296436',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Use ',
          styles: {},
        },
        {
          type: 'text',
          text: ' //  ',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: 'as a shortcut to create a new task',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '911eaf29-dbc9-479f-8b72-eb42755690ea',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tap 3 times the text line to format it, or select a word/phrase to apply formatting',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '02eb534f-f553-42f3-a5af-430e367bf6db',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Use the icon on the left to delete, add, or change the color of the line',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'b2722221-8786-4fe5-bf23-c9f0f1dd6658',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Type ',
          styles: {},
        },
        {
          type: 'text',
          text: '@',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' anywhere to mention or assign a teammate',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '5efe926f-d1ad-43e6-99c4-445b2f261884',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Use ',
          styles: {},
        },
        {
          type: 'text',
          text: 'Tab',
          styles: {
            bold: true,
            backgroundColor: 'purple',
          },
        },
        {
          type: 'text',
          text: ' on the next line to add any content',
          styles: {},
        },
      ],
      children: [
        {
          id: '85947f2f-9685-46b6-9da6-2ec38d1c801b',
          type: 'paragraph',
          props: {
            textColor: 'default',
            backgroundColor: 'default',
            textAlignment: 'left',
          },
          content: [
            {
              type: 'text',
              text: 'Now, if you drag and drop the content up or down using the icon to the left of the main line, the description under the tab will stay attached and move with the task container',
              styles: {},
            },
          ],
          children: [],
        },
        {
          id: '82da6a05-5d03-47f4-b995-46ef845977b7',
          type: 'video',
          props: {
            backgroundColor: 'default',
            textAlignment: 'left',
            name: 'Screen Recording 2025-05-15 at 7.37.14 AM.mov',
            url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/videos%2Fvideo_1747283942976.quicktime?alt=media&token=58a14200-244d-4a60-94bd-d87371a09cf9',
            caption: '',
            showPreview: true,
            previewWidth: 351,
          },
          children: [],
        },
      ],
    },
    {
      id: 'caaea502-e1ed-4e59-b8ee-146dfe65807b',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '652c8047-b062-44cb-9436-f85e4f41249a',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '3. Discussions',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '7e929764-ec29-4cb0-9ee7-888f5430e50c',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tap the Discussion icon on the left to start a new one',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '26497243-9377-40c6-b49c-4efdfcd1ad54',
      type: 'video',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'Screen Recording 2025-05-15 at 7.46.11 AM.mov',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/videos%2Fvideo_1747284429653.quicktime?alt=media&token=544045cd-b07b-4331-af12-0d5a3ccf3792',
        caption: '',
        showPreview: true,
        previewWidth: 670,
      },
      children: [],
    },
    {
      id: 'd1f05b22-ebca-4707-bdd1-450c5d7a4126',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '7e357d31-cb8b-4821-a87d-bfea3e37d71f',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '4. Attachements',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '0437f341-c9e7-4498-8b32-33dea3530127',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Every attachment (links, images, videos, files) you drop into the topic will appear in the tab on the right, so you can quickly find them',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '682f344a-079e-43a0-b8dc-c2a1525ec198',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '9246a1a1-8157-425b-bd30-c7bc210606fe',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '5e234013-ef6d-44c4-998c-78e437ca5f6e',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '76d6a664-6401-4494-b5cf-bbcfc19d9bd3',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'd2c34dfa-a243-449d-8791-2a6868f65ea2',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
  ],
  lCCTRB6qS6oBJrObRsfP: [
    {
      id: 'initialBlockId',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Text us (',
          styles: {},
        },
        {
          type: 'link',
          href: 'mailto:hi@dun.wtf',
          content: [
            {
              type: 'text',
              text: 'hi@dun.wtf',
              styles: {},
            },
          ],
        },
        {
          type: 'text',
          text: ') if you come up with your own convenient one :)',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '5821b559-f760-4175-863c-c2a5f1a1bd4d',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '39a8cb06-cad3-4f18-a26a-0868756210b0',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: 'Topic contains:',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '381d57e5-7b94-455b-bb01-15df9901edc6',
      type: 'numberedListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '1:1 — similar to direct messages',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '116590c2-9c00-46b1-a80b-f1fce19c6523',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: '9b451873-6a92-404e-8db6-30eec2d9e6f4',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
    {
      id: 'f036a3bc-ca19-4385-a13d-afa0106a97b8',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [
        {
          type: 'text',
          text: '1. 1:1 — similar to direct messages',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'f1745f26-3ba1-4669-b371-1c02a05faaeb',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: "For example, title the topic '1:1 Mark and Chloe'",
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '1d10363a-7123-4305-b1f4-f77efc5b37c5',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Create as many discussions on different themes or use one like a classic chat create a new line as a title for discussion and ',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: '1538a110-9e8b-4566-9919-11cc805f82c1',
      type: 'video',
      props: {
        backgroundColor: 'default',
        textAlignment: 'left',
        name: 'Screen Recording 2025-05-15 at 8.10.59 AM.mov',
        url: 'https://firebasestorage.googleapis.com/v0/b/dun-imba.appspot.com/o/videos%2Fvideo_1747286027291.quicktime?alt=media&token=47f0f5a3-6527-49ac-b290-4a913632d8dc',
        caption: '',
        showPreview: true,
        previewWidth: 512,
      },
      children: [],
    },
    {
      id: '766ef2e9-6e48-40e3-bb17-0a87816c8c55',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [],
      children: [],
    },
  ],
}