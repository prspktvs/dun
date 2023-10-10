import { defaultProps } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import React, { useRef, useState } from 'react'
import { jsx as _jsx } from 'react/jsx-runtime'
import { jsxs as _jsxs } from 'react/jsx-runtime'
export const imageSchema = {
  src: {
    default: 'https://via.placeholder.com/1000',
  },
  alt: {
    default: 'image',
  },
}
export const ImageBlock = createReactBlockSpec({
  type: 'image',
  propSchema: {
    ...defaultProps,
    ...imageSchema,
  },
  containsInlineContent: false,
  render: ({ block }) => {
    const { props } = block
    const { src: defaultSrc, alt } = props
    const [src, setSrc] = useState(defaultSrc)
    const inputRef = useRef(null)
    const handleChange = async (e) => {
      const file = e.target.files[0]
      const timestamp = new Date().getTime()
      const fileExtension = file.name.split('.').pop()
      const newFileName = `${timestamp}.${fileExtension}`
      const url = await uploadImage(newFileName, file)
      props.src = url || ''
      if (url) setSrc(url)
    }
    const handleClick = () => {
      var _inputRef$current
      return (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0
        ? void 0
        : _inputRef$current.click()
    }
    if (src)
      return /*#__PURE__*/ _jsx('img', {
        className: 'max-h-[300px] max-w-[300px]',
        src: src,
        alt: alt,
        contentEditable: false,
      })
    return /*#__PURE__*/ _jsxs('div', {
      children: [
        /*#__PURE__*/ _jsx('input', {
          ref: inputRef,
          type: 'file',
          accept: 'image/*',
          onChange: handleChange,
          hidden: true,
        }),
        /*#__PURE__*/ _jsx('button', {
          onClick: handleClick,
          children: 'Choose your image',
        }),
      ],
    })
  },
})
