import { createReactInlineContentSpec } from '@blocknote/react'

export const Mention = createReactInlineContentSpec(
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
    render: (props) => <span className='font-semibold'>@{props.inlineContent.props.label}</span>,
  },
)
