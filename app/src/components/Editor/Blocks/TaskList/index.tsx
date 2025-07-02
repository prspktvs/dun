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

const STATUS_OPTIONS = [
  TaskStatus.NoStatus,
  TaskStatus.Planned,
  TaskStatus.InProgress,
  TaskStatus.InReview,
  TaskStatus.Done,
]

const PRIORITY_OPTIONS = [
  TaskPriority.NoPriority,
  TaskPriority.Low,
  TaskPriority.Medium,
  TaskPriority.High,
  TaskPriority.Urgent,
]

export const getCurrentUser = () => auth.currentUser

export const splitBlockCommand =
  (posInBlock: number, keepType?: boolean, keepProps?: boolean) =>
  ({ state, dispatch }: { state: EditorState; dispatch?: (args?: any) => any }) => {
    const nearestBlockContainerPos = getNearestBlockPos(state.doc, posInBlock)
    const info = getBlockInfo(nearestBlockContainerPos)

    if (!info.isBlockContainer) {
      throw new Error(`BlockContainer expected at position ${posInBlock}`)
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

export function getListItemContent(node: Node, schema: Schema, name: string): Fragment {
  const parser = DOMParser.fromSchema(schema)
  const clonedNodeDiv = document.createElement('div')
  clonedNodeDiv.setAttribute('data-node-type', 'blockGroup')

  Array.from((node as HTMLElement).childNodes).forEach((child) =>
    clonedNodeDiv.appendChild(child.cloneNode(true)),
  )

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

  return remainingListItemChildren.size > 0
    ? listItemNode.content.addToEnd(blockGroupNode.copy(remainingListItemChildren))
    : listItemNode.content
}

export const handleEnter = (editor: BlockNoteEditor<any, any, any>) => {
  const { blockInfo, selectionEmpty } = editor.transact((tr) => ({
    blockInfo: getBlockInfoFromTransaction(tr),
    selectionEmpty: tr.selection.anchor === tr.selection.head,
  }))

  if (!blockInfo.isBlockContainer) return false

  const { bnBlock: blockContainer, blockContent } = blockInfo

  if (blockContent.node.type.name !== 'task' || !selectionEmpty) return false

  return editor._tiptapEditor.commands.first(({ state, chain, commands }) => [
    () =>
      commands.command(() => {
        if (blockContent.node.childCount === 0) {
          return commands.command(
            updateBlockCommand(blockContainer.beforePos, { type: 'paragraph', props: {} }),
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
  isDone: { default: false },
  status: { default: TaskStatus.NoStatus },
  priority: { default: TaskPriority.NoPriority },
  author: { default: auth.currentUser ? auth.currentUser.uid : '' },
  selectorsVisible: { default: false },
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
                props: { isDone: false, author: user ? user.uid : '' },
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
            props: { isDone: false, author: user ? user.uid : '' },
          }),
        )
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `div[data-content-type=${this.name}]`,
        contentElement: '.bn-inline-content',
      },
      {
        tag: 'input',
        getAttrs: (element) =>
          typeof element !== 'string' &&
          !element.closest('[data-content-type]') &&
          !element.closest('li') &&
          (element as HTMLInputElement).type === 'checkbox'
            ? { isDone: (element as HTMLInputElement).checked }
            : false,
        node: 'task',
      },
      {
        tag: 'li',
        getAttrs: (element) => {
          if (typeof element === 'string') return false
          const parent = element.parentElement
          if (!parent) return false
          if (
            parent.tagName === 'UL' ||
            (parent.tagName === 'DIV' && parent.parentElement?.tagName === 'UL')
          ) {
            const checkbox =
              (element.querySelector('input[type=checkbox]') as HTMLInputElement) || null
            return checkbox ? { isDone: checkbox.checked } : false
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
    if (node.attrs.isDone) checkbox.setAttribute('checked', '')

    const { dom, contentDOM } = createDefaultBlockDOMOutputSpec(
      this.name,
      'p',
      { ...(this.options.domAttributes?.blockContent || {}), ...HTMLAttributes },
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

      const selectorsWrapper = document.createElement('div')
      selectorsWrapper.className = `
        flex 
        absolute 
        z-40 
        gap-2 
        rounded
        -top-6 
        left-9
      `
      selectorsWrapper.style.display = node.attrs.selectorsVisible ? 'flex' : 'none'

      const statusSelect = document.createElement('select')
      statusSelect.classList.add('text-sm', 'border', 'rounded', 'px-2', 'py-1')
      STATUS_OPTIONS.forEach((status) => {
        const option = document.createElement('option')
        option.value = status
        option.textContent = status
        option.selected = node.attrs.status === status
        statusSelect.appendChild(option)
      })

      const prioritySelect = document.createElement('select')
      prioritySelect.classList.add('text-sm', 'border', 'rounded', 'px-2', 'py-1')
      PRIORITY_OPTIONS.forEach((priority) => {
        const option = document.createElement('option')
        option.value = priority
        option.textContent = priority
        option.selected = node.attrs.priority === priority
        prioritySelect.appendChild(option)
      })

      selectorsWrapper.appendChild(statusSelect)
      selectorsWrapper.appendChild(prioritySelect)

      const updateCheckboxState = (isDone: boolean) => {
        if (typeof getPos === 'function') {
          const beforeBlockContainerPos = getNearestBlockPos(editor.state.doc, getPos())
          editor.commands.command(
            updateBlockCommand(beforeBlockContainerPos.posBeforeNode, {
              type: 'task',
              props: {
                ...node.attrs,
                isDone,
                status: isDone ? TaskStatus.Done : TaskStatus.NoStatus,
              },
            }),
          )
          checkbox.checked = isDone
          customCheckbox.className = isDone
            ? 'ri-checkbox-line text-lg'
            : 'ri-checkbox-blank-line text-lg'
        }
      }

      const updateTaskProps = (newProps: Partial<typeof node.attrs>) => {
        if (typeof getPos === 'function') {
          const pos = getPos()
          if (pos === undefined || pos < 0) {
            console.error('Invalid position returned by getPos:', pos)
            return
          }

          const currentNode = editor.state.doc.nodeAt(pos)
          if (!currentNode) {
            console.error('Node not found at position:', pos)
            return
          }

          const updatedAttrs = { ...currentNode.attrs, ...newProps }
          console.log('Updating task props:', updatedAttrs)

          editor.commands.command(({ tr }) => {
            try {
              tr.setNodeMarkup(pos, undefined, updatedAttrs)
              console.log('Task props updated successfully:', updatedAttrs)
            } catch (error) {
              console.error('Failed to update task props:', error)
            }
          })
        } else {
          console.error('getPos is not a function or is undefined.')
        }
      }

      statusSelect.addEventListener('change', (e) => {
        const newStatus = (e.target as HTMLSelectElement).value as TaskStatus
        updateTaskProps({ status: newStatus })
      })

      prioritySelect.addEventListener('change', (e) => {
        const newPriority = (e.target as HTMLSelectElement).value as TaskPriority
        updateTaskProps({ priority: newPriority })
      })

      const toggleSelectors = (e: Event) => {
        e.preventDefault()
        const newSelectorsVisible = !node.attrs.selectorsVisible

        editor.commands.command(({ tr }) => {
          try {
            const pos = getPos()
            if (pos === undefined || pos < 0) {
              console.error('Invalid position returned by getPos:', pos)
              return
            }

            const currentNode = editor.state.doc.nodeAt(pos)
            if (!currentNode) {
              console.error('Node not found at position:', pos)
              return
            }

            const updatedAttrs = {
              ...currentNode.attrs,
              selectorsVisible: newSelectorsVisible,
            }

            tr.setNodeMarkup(pos, undefined, updatedAttrs)

            selectorsWrapper.style.display = newSelectorsVisible ? 'flex' : 'none'
          } catch (error) {
            console.error('Failed to toggle selectors:', error)
          }
        })
      }

      const hideSelectors = (e: Event) => {
        const target = e.target as Node
        if (!dom.contains(target) && !selectorsWrapper.contains(target)) {
          editor.commands.command(({ tr }) => {
            try {
              const pos = getPos()
              if (pos === undefined || pos < 0) {
                console.error('Invalid position returned by getPos:', pos)
                return
              }

              const currentNode = editor.state.doc.nodeAt(pos)
              if (!currentNode) {
                console.error('Node not found at position:', pos)
                return
              }

              const updatedAttrs = {
                ...currentNode.attrs,
                selectorsVisible: false,
              }

              tr.setNodeMarkup(pos, undefined, updatedAttrs)

              selectorsWrapper.style.display = 'none'
            } catch (error) {
              console.error('Failed to hide selectors:', error)
            }
          })
        }
      }

      const handleCheckboxClick = (e: Event) => {
        e.stopPropagation()
        if (!editor.isEditable) return
        updateCheckboxState(!node.attrs.isDone)
      }

      checkboxWrapper.addEventListener('click', handleCheckboxClick)
      checkboxWrapper.appendChild(checkbox)
      checkboxWrapper.appendChild(customCheckbox)

      const statusWrapper = document.createElement('div')
      statusWrapper.classList.add('flex', 'gap-2', 'w-40')

      const statusSpan = document.createElement('span')
      const prioritySpan = document.createElement('span')
      statusSpan.className = 'text-14 font-rubik text-[#969696]'
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
      if (node.attrs.status !== TaskStatus.NoStatus) {
        statusSpan.textContent = node.attrs.status
      }
      if (node.attrs.priority !== TaskPriority.NoPriority) {
        prioritySpan.textContent = node.attrs.priority
      }
      statusWrapper.appendChild(statusSpan)
      statusWrapper.appendChild(prioritySpan)

      const { dom, contentDOM } = createDefaultBlockDOMOutputSpec(
        this.name,
        'p',
        { ...(this.options.domAttributes?.blockContent || {}), ...HTMLAttributes },
        this.options.domAttributes?.inlineContent || {},
      )

      if (node.attrs.isDone) {
        contentDOM.classList.add('line-through', 'text-gray-400')
      } else {
        contentDOM.classList.remove('line-through', 'text-gray-400')
      }

      if (typeof getPos === 'function') {
        const blockID = editor.state.doc.resolve(getPos()).node().attrs.id
        const label = 'label-' + blockID
        checkbox.setAttribute('aria-labelledby', label)
        contentDOM.id = label
      }

      const taskContainer = document.createElement('div')
      taskContainer.classList.add('task-container')

      dom.style.cursor = 'pointer'
      dom.addEventListener('click', toggleSelectors)
      document.addEventListener('click', hideSelectors)
      selectorsWrapper.addEventListener('click', (e) => e.stopPropagation())

      const update = (updatedNode: any) => {
        selectorsWrapper.style.display = updatedNode.attrs.selectorsVisible ? 'flex' : 'none'
        statusSpan.style.display =
          updatedNode.attrs.status === TaskStatus.NoStatus ? 'none' : 'inline'
        prioritySpan.style.display =
          updatedNode.attrs.priority === TaskPriority.NoPriority ? 'none' : 'inline'
        if (updatedNode.attrs.status !== TaskStatus.NoStatus) {
          statusSpan.textContent = updatedNode.attrs.status
        }
        if (updatedNode.attrs.priority !== TaskPriority.NoPriority) {
          prioritySpan.textContent = updatedNode.attrs.priority
          prioritySpan.className = `text-14 font-rubik ${
            updatedNode.attrs.priority === TaskPriority.Low
              ? 'text-priority-low'
              : updatedNode.attrs.priority === TaskPriority.Medium
                ? 'text-priority-medium'
                : updatedNode.attrs.priority === TaskPriority.High
                  ? 'text-priority-high'
                  : updatedNode.attrs.priority === TaskPriority.Urgent
                    ? 'text-priority-urgent'
                    : ''
          }`
        }
        return true
      }

      dom.removeChild(contentDOM)
      dom.appendChild(taskContainer)
      checkboxWrapper.appendChild(selectorsWrapper)
      taskContainer.appendChild(wrapper)
      wrapper.appendChild(checkboxWrapper)
      wrapper.appendChild(contentDOM)
      wrapper.appendChild(statusWrapper)

      return {
        dom,
        contentDOM,
        update,
        destroy: () => {
          checkboxWrapper.removeEventListener('click', handleCheckboxClick)
          dom.removeEventListener('click', toggleSelectors)
          document.removeEventListener('click', hideSelectors)
        },
      }
    }
  },
})

export const TaskList = createBlockSpecFromStronglyTypedTiptapNode(taskBlockContent, taskPropSchema)
