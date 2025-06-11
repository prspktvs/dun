import { InputRule } from '@tiptap/core'
import {
  BlockNoteEditor,
  createBlockSpecFromStronglyTypedTiptapNode,
  createDefaultBlockDOMOutputSpec,
  createStronglyTypedTiptapNode,
  defaultProps,
  getBlockInfo,
  getBlockInfoFromSelection,
  getBlockInfoFromTransaction,
  getNearestBlockPos,
  PropSchema,
  propsToAttributes,
  updateBlockCommand,
} from '@blocknote/core'
import { DOMParser, Fragment, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import { TaskPriority, TaskStatus } from '../../../../types/Task.d.ts'
import { auth } from '../../../../config/firebase.js'

export const getCurrentUser = () => {
  const user = auth.currentUser

  return user
}

export const splitBlockCommand = (posInBlock: number, keepType?: boolean, keepProps?: boolean) => {
  return ({
    state,
    dispatch,
  }: {
    state: EditorState
    dispatch: ((args?: any) => any) | undefined
  }) => {
    const nearestBlockContainerPos = getNearestBlockPos(state.doc, posInBlock)

    const info = getBlockInfo(nearestBlockContainerPos)

    if (!info.isBlockContainer) {
      throw new Error(`BlockContainer expected when calling splitBlock, position ${posInBlock}`)
    }

    const types = [
      {
        type: info.bnBlock.node.type,
        attrs: keepProps ? { ...info.bnBlock.node.attrs, id: undefined } : {},
      },
      {
        type: keepType ? info.blockContent.node.type : state.schema.nodes['paragraph'],
        attrs: keepProps ? { ...info.blockContent.node.attrs } : {},
      },
    ]

    if (dispatch) {
      state.tr.split(posInBlock, 2, types)
    }

    return true
  }
}

export function getListItemContent(_node: Node, schema: Schema, name: string): Fragment {
  const parser = DOMParser.fromSchema(schema)

  const node = _node as HTMLElement

  const clonedNodeDiv = document.createElement('div')

  clonedNodeDiv.setAttribute('data-node-type', 'blockGroup')

  for (const child of Array.from(node.childNodes)) {
    clonedNodeDiv.appendChild(child.cloneNode(true))
  }

  let blockGroupNode = parser.parse(clonedNodeDiv, {
    topNode: schema.nodes.blockGroup.create(),
  })

  if (blockGroupNode.firstChild?.firstChild?.type.name === 'task') {
    blockGroupNode = blockGroupNode.copy(
      blockGroupNode.content.cut(blockGroupNode.firstChild.firstChild.nodeSize + 2),
    )
  }

  const listItemsFirstChild = blockGroupNode.firstChild?.firstChild

  if (!listItemsFirstChild?.isTextblock) {
    return Fragment.from(blockGroupNode)
  }

  const listItemNode = schema.nodes[name].create({}, listItemsFirstChild.content)

  const remainingListItemChildren = blockGroupNode.content.cut(listItemsFirstChild.nodeSize + 2)
  const hasRemainingListItemChildren = remainingListItemChildren.size > 0

  if (hasRemainingListItemChildren) {
    const listItemsChildren = blockGroupNode.copy(remainingListItemChildren)

    return listItemNode.content.addToEnd(listItemsChildren)
  }

  return listItemNode.content
}

export const handleEnter = (editor: BlockNoteEditor<any, any, any>) => {
  const { blockInfo, selectionEmpty } = editor.transact((tr) => {
    return {
      blockInfo: getBlockInfoFromTransaction(tr),
      selectionEmpty: tr.selection.anchor === tr.selection.head,
    }
  })

  if (!blockInfo.isBlockContainer) {
    return false
  }
  const { bnBlock: blockContainer, blockContent } = blockInfo

  if (!(blockContent.node.type.name === 'task') || !selectionEmpty) {
    return false
  }

  return editor._tiptapEditor.commands.first(({ state, chain, commands }) => [
    () =>
      commands.command(() => {
        if (blockContent.node.childCount === 0) {
          return commands.command(
            updateBlockCommand(blockContainer.beforePos, {
              type: 'paragraph',
              props: {},
            }),
          )
        }

        return false
      }),

    () =>
      commands.command(() => {
        if (blockContent.node.childCount > 0) {
          chain().deleteSelection().command(splitBlockCommand(state.selection.from, true)).run()

          return true
        }

        return false
      }),
  ])
}

export const taskPropSchema = {
  ...defaultProps,
  isDone: {
    default: false,
  },
  status: {
    default: TaskStatus.NoStatus,
  },
  priority: {
    default: TaskPriority.NoPriority,
  },
  author: {
    default: auth.currentUser ? auth.currentUser.uid : '',
  },
} satisfies PropSchema

const taskBlockContent = createStronglyTypedTiptapNode({
  name: 'task',
  content: 'inline*',
  group: 'blockContent',

  addAttributes() {
    return propsToAttributes(taskPropSchema)
  },

  addInputRules() {
    return [
      new InputRule({
        find: new RegExp(`\\//\\s$`),
        handler: ({ state, chain, range }) => {
          const blockInfo = getBlockInfoFromSelection(state)
          if (
            !blockInfo.isBlockContainer ||
            blockInfo.blockContent.node.type.spec.content !== 'inline*'
          ) {
            return
          }
          const user = getCurrentUser()

          chain()
            .command(
              updateBlockCommand(blockInfo.bnBlock.beforePos, {
                type: 'task',
                props: {
                  isDone: false as any,
                  author: user ? user.uid : '',
                },
              }),
            )
            .deleteRange({ from: range.from, to: range.to })
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => handleEnter(this.options.editor),
      'Mod-Shift-0': () => {
        const blockInfo = getBlockInfoFromSelection(this.editor.state)
        if (
          !blockInfo.isBlockContainer ||
          blockInfo.blockContent.node.type.spec.content !== 'inline*'
        ) {
          return true
        }
        const user = getCurrentUser()

        return this.editor.commands.command(
          updateBlockCommand(blockInfo.bnBlock.beforePos, {
            type: 'task',
            props: {
              isDone: false,
              author: user ? user.uid : '',
            },
          }),
        )
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-content-type=' + this.name + ']',
        contentElement: '.bn-inline-content',
      },
      {
        tag: 'input',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false
          }

          if (element.closest('[data-content-type]') || element.closest('li')) {
            return false
          }

          if ((element as HTMLInputElement).type === 'checkbox') {
            return { isDone: (element as HTMLInputElement).checked }
          }

          return false
        },
        node: 'task',
      },
      {
        tag: 'li',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false
          }

          const parent = element.parentElement

          if (parent === null) {
            return false
          }

          if (
            parent.tagName === 'UL' ||
            (parent.tagName === 'DIV' && parent.parentElement?.tagName === 'UL')
          ) {
            const checkbox =
              (element.querySelector('input[type=checkbox]') as HTMLInputElement) || null

            if (checkbox === null) {
              return false
            }

            return { isDone: checkbox.checked }
          }

          return false
        },
        getContent: (node, schema) => getListItemContent(node, schema, this.name),
        node: 'task',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = node.attrs.isDone
    if (node.attrs.isDone) {
      checkbox.setAttribute('checked', '')
    }

    const { dom, contentDOM } = createDefaultBlockDOMOutputSpec(
      this.name,
      'p',
      {
        ...(this.options.domAttributes?.blockContent || {}),
        ...HTMLAttributes,
      },
      this.options.domAttributes?.inlineContent || {},
    )

    dom.insertBefore(checkbox, contentDOM)

    return { dom, contentDOM }
  },

  addNodeView() {
    return ({ node, getPos, editor, HTMLAttributes }) => {
      const wrapper = document.createElement('div')
      wrapper.classList.add('flex', 'items-start', 'gap-4')

      const checkboxWrapper = document.createElement('div')
      checkboxWrapper.contentEditable = 'false'
      checkboxWrapper.classList.add('cursor-pointer')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = node.attrs.isDone
      checkbox.style.display = 'none'

      const customCheckbox = document.createElement('i')
      customCheckbox.className = node.attrs.isDone
        ? 'ri-checkbox-line text-lg'
        : 'ri-checkbox-blank-line text-lg'

      const updateCheckboxState = (isDone: boolean) => {
        if (typeof getPos === 'function') {
          const beforeBlockContainerPos = getNearestBlockPos(editor.state.doc, getPos())

          editor.commands.command(
            updateBlockCommand(beforeBlockContainerPos.posBeforeNode, {
              type: 'task',
              props: {
                ...node.attrs,
                isDone: isDone,
              },
            }),
          )

          checkbox.checked = isDone
          customCheckbox.className = isDone
            ? 'ri-checkbox-line text-lg'
            : 'ri-checkbox-blank-line text-lg'
        }
      }

      checkboxWrapper.addEventListener('click', () => {
        if (!editor.isEditable) return
        updateCheckboxState(!node.attrs.isDone)
      })

      checkboxWrapper.appendChild(checkbox)
      checkboxWrapper.appendChild(customCheckbox)

      const statusWrapper = document.createElement('div')
      statusWrapper.classList.add('flex', 'gap-2')

      if (node.attrs.status !== TaskStatus.NoStatus) {
        const statusSpan = document.createElement('span')
        statusSpan.className = 'text-14 font-rubik text-[#969696]'
        statusSpan.textContent = node.attrs.status
        statusWrapper.appendChild(statusSpan)
      }

      if (node.attrs.priority !== TaskPriority.NoPriority) {
        const prioritySpan = document.createElement('span')
        prioritySpan.className = `text-14 font-rubik ${
          node.attrs.priority === TaskPriority.Low
            ? 'text-priority-low'
            : node.attrs.priority === TaskPriority.Medium
              ? 'text-priority-medium'
              : node.attrs.priority === TaskPriority.High
                ? 'text-priority-high'
                : node.attrs.priority === TaskPriority.Urgent
                  ? 'text-priority-urgent'
                  : ''
        }`
        prioritySpan.textContent = node.attrs.priority
        statusWrapper.appendChild(prioritySpan)
      }

      const { dom, contentDOM } = createDefaultBlockDOMOutputSpec(
        this.name,
        'p',
        {
          ...(this.options.domAttributes?.blockContent || {}),
          ...HTMLAttributes,
        },
        this.options.domAttributes?.inlineContent || {},
      )

      if (typeof getPos === 'function') {
        const blockID = editor.state.doc.resolve(getPos()).node().attrs.id
        const label = 'label-' + blockID
        checkbox.setAttribute('aria-labelledby', label)
        contentDOM.id = label
      }

      dom.removeChild(contentDOM)
      dom.appendChild(wrapper)
      wrapper.appendChild(checkboxWrapper)
      wrapper.appendChild(contentDOM)
      wrapper.appendChild(statusWrapper)

      return {
        dom,
        contentDOM,
        destroy: () => {
          checkboxWrapper.removeEventListener('click', () => {})
        },
      }
    }
  },
})

export const TaskList = createBlockSpecFromStronglyTypedTiptapNode(taskBlockContent, taskPropSchema)
