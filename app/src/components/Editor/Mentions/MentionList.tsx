import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useProject } from '../../../context/ProjectContext'

export default forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { project } = useProject()

  const selectItem = (index) => {
    const item = project?.users[index]

    if (item) {
      props.command({ label: item.name, id: item.id })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + project?.users.length - 1) % project?.users.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % project?.users.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [project?.users])

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
      {project?.users?.length > 0 ? (
        project.users.map((item, index) => (
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
