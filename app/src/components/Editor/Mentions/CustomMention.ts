import { mergeAttributes, Node } from '@tiptap/core'
import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { PluginKey } from '@tiptap/pm/state'
import { blockStyles } from '@blocknote/core'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import { getBlockInfoFromPos } from './helper'

export type MentionOptions = {
  HTMLAttributes: Record<string, any>
  renderText: (props: { options: MentionOptions; node: ProseMirrorNode }) => string
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export const MentionPluginKey = new PluginKey('mention')

export const CustomMention = Node.create<MentionOptions>({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ options, node }) {
        return `${options.suggestion.char}${node.attrs.name ?? node.attrs.uid}`
      },
      suggestion: {
        char: '@',
        pluginKey: MentionPluginKey,
        command: ({ editor, range, props: user }) => {
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace) {
            range.to += 1
          }

          // editor
          //   .chain()
          //   .focus()
          //   .insertContentAt(
          //     range,
          //     `<span></span><a href="${user.url}">@${user.name}</a><span> </span>`,
          //   )
          //   .run()
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: user,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()
          const block = getBlockInfoFromPos(editor.state.doc, editor.state.selection.from)
          if (block.contentType.name === 'task') {
            const { users } = block.node.content?.content?.[0].attrs

            editor.commands.BNUpdateBlock(editor.state.selection.from, {
              props: {
                users: [...users, user],
              },
            })
          }

          window.getSelection()?.collapseToEnd()
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          const allow = !!$from.parent.type.contentMatch.matchType(type)

          return allow
        },
      },
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: false,

  addAttributes() {
    //console.log('addAttributes', arguments, this.parent)
    return {
      uid: {
        default: null,
        parseHTML: (element) => (
          console.log('parseHTML', element), element.getAttribute('data-id')
        ),
        renderHTML: (attributes) => {
          console.log('renderHTML', attributes)
          if (!attributes.id) {
            return {}
          }

          return {
            'data-uid': attributes.uid,
          }
        },
      },

      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {}
          }

          return {
            'data-name': attributes.name,
          }
        },
      },
    }
  },

  parseHTML() {
    console.log('parseHTML', arguments)
    return [
      {
        tag: `a[data-uid]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        { ...this.options.HTMLAttributes, class: 'mention', 'data-content-type': this.name },
        HTMLAttributes,
      ),
      this.options.renderText({
        options: this.options,
        node,
      }),
    ]
  },

  renderText({ node }) {
    console.log('renderText', arguments)
    return this.options.renderText({
      options: this.options,
      node,
    })
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false
          const { selection } = state
          const { empty, anchor } = selection

          if (!empty) {
            return false
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true
              tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize)

              return false
            }
          })

          return isMention
        }),
    }
  },

  addProseMirrorPlugins() {
    console.log('addProseMirrorPlugins', this.options.suggestion)
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
