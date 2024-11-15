import {
  BlockFromConfig,
  BlockNoteEditor,
  createAddFileButton,
  InlineContentSchema,
  StyleSchema,
  BlockSchema,
  BlockNoteSchema,
  createBlockSpec,
  imageBlockConfig,
  imageParse,
  imageRender,
  imageToExternalHTML,
} from '@blocknote/core'

const ImageBlock = createBlockSpec(imageBlockConfig, {
  render: (
    block: BlockFromConfig<typeof imageBlockConfig, InlineContentSchema, StyleSchema>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor: BlockNoteEditor<any, InlineContentSchema, StyleSchema>,
  ) => {
    const { dom, destroy } = imageRender(block, editor)

    if (block.props.url) {
      dom.style.position = 'relative'
      const button = document.createElement('button')
      button.className =
        'absolute top-1 right-1 p-1 h-6 w-6 bg-gray-100 border-1 border-black rounded-[4px] flex items-center justify-center'
      button.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const event = new CustomEvent('open-file-preview', { detail: block.props.url })
        window.dispatchEvent(event)
      }

      const icon = document.createElement('i')
      icon.className = 'ri-fullscreen-fill'

      button.appendChild(icon)
      dom.appendChild(button)
    }

    return {
      dom,
      destroy,
    }
  },
  parse: imageParse,
  toExternalHTML: imageToExternalHTML,
})

export default ImageBlock
