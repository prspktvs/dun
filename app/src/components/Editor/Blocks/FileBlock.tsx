import { defaultProps, imageParse, imageToExternalHTML } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { useEffect, useRef, useState } from 'react'
import { uploadImage } from '../../../../services'
import { usePreview } from '../../../../context/FilePreviewContext'
import { useProject } from '../../../../context/ProjectContext'
import { useParams } from 'react-router-dom'
import { uploadFile } from '../../../../services/upload.service'

const imageSchema = {
  src: {
    default: '',
  },
  alt: {
    default: 'image',
  },
}

const ImageBlock = createReactBlockSpec(
  {
    type: 'image',
    propSchema: {
      ...defaultProps,
      ...imageSchema,
    },
    content: 'inline',
  },
  {
    render: ({ block, editor }) => {
      const { props } = block
      const { src: defaultSrc, alt } = props
      const { cardId } = useParams()

      const { updateCard } = useProject()

      const { setFileUrl } = usePreview()

      const [src, setSrc] = useState(defaultSrc)

      const inputRef = useRef(null)

      const handleChange = async (e) => {
        const file = e.target.files[0]

        const url = await uploadFile(file)
        if (!url) return

        updateCard({ id: cardId, files: [{ id: block.id, type: 'image', url }] })
        console.log('Uploaded', url)

        editor.updateBlock(block, { props: { src: url } })

        if (url) setSrc(url)
      }

      const handleClick = () => inputRef.current?.click()

      if (src || defaultSrc)
        return (
          <img
            className='max-h-[300px] max-w-[300px] hover:cursor-pointer'
            onClick={() => setFileUrl(src || defaultSrc)}
            src={src || defaultSrc}
            alt={alt}
            contentEditable={false}
          />
        )

      return (
        <div>
          <input ref={inputRef} type='file' accept='image/*' onChange={handleChange} hidden />
          <button onClick={handleClick}>Choose your image</button>
        </div>
      )
    },
    parse: (element: HTMLElement) => {
      console.log('parse', element)
      return imageParse(element)
    },
    toExternalHTML: (block) => {
      console.log('toExternalHTML', block)
      return imageToExternalHTML(block)
    },
  },
)

export default ImageBlock
