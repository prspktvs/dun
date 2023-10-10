import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from './MentionList'

export default {
  items: ({ query }) => {
    return users.filter((user) => user.name.toLowerCase().startsWith(query.toLowerCase()))
  },

  render: () => {
    let component
    let popup

    return {
      onStart: (props) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        } else if (props.event.key === 'Enter') {
          popup[0].destroy()
          return component.ref?.onKeyDown(props)
        }
        return component.ref?.onKeyDown(props)
      },

      onExit() {
        component.destroy()
      },
    }
  },
}
