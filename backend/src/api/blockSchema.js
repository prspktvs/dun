import { InputRule } from '@tiptap/core'
import {
  createBlockSpec,
  createBlockSpecFromStronglyTypedTiptapNode,
  createDefaultBlockDOMOutputSpec,
  createStronglyTypedTiptapNode,
  defaultProps,
  getBlockInfoFromSelection,
  getBlockInfoFromTransaction,
  imageBlockConfig,
  imageParse,
  imageToExternalHTML,
  propsToAttributes,
  updateBlockCommand,
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from '@blocknote/core'
import { DOMParser, Fragment } from 'prosemirror-model'
import { createReactInlineContentSpec } from '@blocknote/react'

export const TaskStatus = {
  NoStatus: 'no status',
  Planned: 'Planned',
  InProgress: 'In progress',
  InReview: 'In review',
  Done: 'Dun',
}

export const TaskPriority = {
  NoPriority: 'no priority',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Urgent: 'Urgent',
}

export function getListItemContent(node, schema, name) {
  const parser = DOMParser.fromSchema(schema)
  const clonedNodeDiv = {}
  clonedNodeDiv.setAttribute('data-node-type', 'blockGroup')

  Array.from(node.childNodes).forEach((child) => clonedNodeDiv.appendChild(child.cloneNode(true)))

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

export const handleEnter = (editor) => {
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
          chain().deleteSelection().command().run()
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
  author: { default: '' },
  selectorsVisible: { default: false },
}

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
          const user = {}

          chain()
            .command(
              updateBlockCommand(blockInfo.bnBlock.beforePos, {
                type: 'task',
                props: { isDone: false, author: '' },
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
        const user = {}

        return this.editor.commands.command(
          updateBlockCommand(blockInfo.bnBlock.beforePos, {
            type: 'task',
            props: { isDone: false, author: '' },
          }),
        )
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: `div[data-content-type=task]`,
        contentElement: '.bn-inline-content',
      },
      {
        tag: 'input',
        getAttrs: (element) =>
          typeof element !== 'string' && element.type === 'checkbox'
            ? { isDone: element.checked }
            : false,
        node: 'task',
      },
      {
        tag: 'li',
        getAttrs: (element) => {
          if (typeof element === 'string') return false
          const checkbox = element.querySelector('input[type=checkbox]')
          return checkbox ? { isDone: checkbox.checked } : false
        },
        node: 'task',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { dom, contentDOM } = createDefaultBlockDOMOutputSpec(
      'task',
      'p',
      { ...HTMLAttributes },
      {},
    )

    return { dom, contentDOM }
  },
})

const TaskList = createBlockSpecFromStronglyTypedTiptapNode(taskBlockContent, taskPropSchema)

const ImageBlock = createBlockSpec(imageBlockConfig, {
  render: () => {
    return {}
  },
  parse: imageParse,
  toExternalHTML: imageToExternalHTML,
})

const Mention = createReactInlineContentSpec(
  {
    type: 'mention',
    propSchema: {
      id: {
        default: '',
      },
      label: {
        default: '',
      },
    },
    content: 'none',
  },
  {
    render: (props) => {},
  },
)

export const EDITOR_SCHEMA = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    task: TaskList,
    image: ImageBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
})
