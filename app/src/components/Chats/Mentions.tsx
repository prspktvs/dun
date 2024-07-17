import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { IUser } from '../../types/User'

export default function Mentions({
  users,
  onSelect,
}: {
  users: IUser[]
  onSelect: (user: IUser) => void
}) {
  const [selectIndex, setSelectIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref?.current) return
    const handler = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          setSelectIndex((prev) => (prev + users.length - 1) % users.length)
          break
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          setSelectIndex((prev) => (prev + 1) % users.length)
          break
        case 'Enter':
          e.preventDefault()
          onSelect(users[selectIndex])
          break
        default:
          break
      }
    }
    document?.addEventListener('keydown', handler)
    return () => document?.removeEventListener('keydown', handler)
  }, [selectIndex, ref.current])

  return (
    <div ref={ref} className='relative overflow-y-scroll bg-purple-300 rounded-md'>
      {users?.length > 0 ? (
        users.map((item, index) => (
          <button
            className={`block w-full text-left p-1 ${
              index === selectIndex
                ? 'bg-purple-500 text-white border-none'
                : 'bg-transparent border-none'
            }`}
            key={index}
            onClick={() => setSelectIndex(index)}
          >
            {'@' + item.name}
          </button>
        ))
      ) : (
        <div className='block w-full text-left'>No result</div>
      )}
    </div>
  )
}
