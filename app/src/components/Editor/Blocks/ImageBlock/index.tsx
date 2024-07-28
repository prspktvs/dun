import {
  BlockFromConfig,
  BlockNoteEditor,
  createAddFileButton,
  createBlockSpec,
  imageBlockConfig,
  imageParse,
  imageRender,
  imageToExternalHTML,
} from '@blocknote/core'

const ImageBlock = createBlockSpec(imageBlockConfig, {
  render: (
    block: BlockFromConfig<typeof imageBlockConfig, any, any>,
    editor: BlockNoteEditor<any, any, any>,
  ) => {
    const { dom, destroy } = imageRender(block, editor)
    dom.addEventListener('click', (e) => {})

    const _destroy = () => {
      dom.removeEventListener('click', (e) => {})
      destroy && destroy()
    }
    return {
      dom,
      destroy: _destroy,
    }
  },
  parse: imageParse,
  toExternalHTML: imageToExternalHTML,
})

export default ImageBlock
