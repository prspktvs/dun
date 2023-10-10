import { defaultProps } from '@blocknote/core'
import { createReactBlockSpec, InlineContent } from '@blocknote/react'
import React, { useEffect } from 'react'
import { jsx as _jsx } from 'react/jsx-runtime'
import { jsxs as _jsxs } from 'react/jsx-runtime'
export function insertOrUpdateBlock(editor, block) {
  const currentBlock = editor.getTextCursorPosition().block
  if (
    (currentBlock.content.length === 1 &&
      currentBlock.content[0].type === 'text' &&
      currentBlock.content[0].text === '/') ||
    currentBlock.content.length === 0
  ) {
    editor.updateBlock(currentBlock, block)
  } else {
    editor.insertBlocks([block], currentBlock, 'after')
    editor.setTextCursorPosition(editor.getTextCursorPosition().nextBlock)
  }
}
const CustomCheckbox = (checked) =>
  !checked
    ? /*#__PURE__*/ _jsx('i', {
        className: 'ri-checkbox-blank-line text-lg',
      })
    : /*#__PURE__*/ _jsx('i', {
        className: 'ri-checkbox-line  text-lg',
      })
export const taskSchema = {
  title: {
    default: '',
  },
  isDone: {
    default: false,
  },
  users: {
    default: [],
  },
}
export const TaskBlock = createReactBlockSpec({
  type: 'task',
  propSchema: {
    ...defaultProps,
    ...taskSchema,
  },
  containsInlineContent: true,
  render: ({ block, editor }) => {
    var _block$content$
    useEffect(() => {
      const handler = (e) => {
        var _prevBlock$content, _prevBlock$content2
        const prevBlock = editor.getTextCursorPosition().prevBlock
        const nextBlock = editor.getTextCursorPosition().nextBlock
        switch (e.key) {
          case 'Enter':
            if (
              (prevBlock === null || prevBlock === void 0 ? void 0 : prevBlock.type) === 'task' &&
              prevBlock !== null &&
              prevBlock !== void 0 &&
              (_prevBlock$content = prevBlock.content) !== null &&
              _prevBlock$content !== void 0 &&
              (_prevBlock$content = _prevBlock$content[0]) !== null &&
              _prevBlock$content !== void 0 &&
              _prevBlock$content.text
            ) {
              insertOrUpdateBlock(editor, {
                type: 'task',
              })
              return
            }
          case 'Backspace':
            if (
              prevBlock !== null &&
              prevBlock !== void 0 &&
              (_prevBlock$content2 = prevBlock.content) !== null &&
              _prevBlock$content2 !== void 0 &&
              (_prevBlock$content2 = _prevBlock$content2[0]) !== null &&
              _prevBlock$content2 !== void 0 &&
              _prevBlock$content2.text
            ) {
              document.removeEventListener('keydown', handler)
              return
            }
          default:
            return
        }
      }
      document.removeEventListener('keydown', handler)
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }, [])
    const isBlockActive = block === editor.getTextCursorPosition().block
    return /*#__PURE__*/ _jsxs('div', {
      className: 'relative flex gap-4 items-center',
      tabIndex: 0,
      children: [
        /*#__PURE__*/ _jsx('div', {
          onClick: () =>
            editor.updateBlock(block, {
              props: {
                isDone: !block.props.isDone,
              },
            }),
          children: /*#__PURE__*/ _jsx(CustomCheckbox, {
            checked: block.props.isDone,
          }),
        }),
        /*#__PURE__*/ _jsx(InlineContent, {
          as: 'div',
        }),
        !(
          block !== null &&
          block !== void 0 &&
          (_block$content$ = block.content[0]) !== null &&
          _block$content$ !== void 0 &&
          _block$content$.text
        ) && isBlockActive
          ? /*#__PURE__*/ _jsx('div', {
              className: 'absolute left-9 text-gray-300 flex items-center italic',
              children: "Enter a text or type '@' to mention user",
            })
          : null,
      ],
    })
  },
})
