import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export default forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index) => {
    const item = props.items[index]

    if (item) {
      props.command({ label: item.name, id: item.id })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className='relative overflow-hidden bg-purple-300 rounded-md'>
      {props?.items?.length > 0 ? (
        props.items.map((item, index) => (
          <button
            className={`block w-full text-left p-1 ${
              index === selectedIndex
                ? 'bg-purple-500 text-white border-none'
                : 'bg-transparent border-none'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {'@' + item.name}
          </button>
        ))
      ) : (
        <div className='block w-full text-left'>No result</div>
      )}
    </div>
  )
})
