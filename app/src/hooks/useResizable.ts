import { useCallback, useEffect, useRef, useState } from 'react'

type ResizeSide = 'left' | 'right'

interface UseResizableOptions {
  storageKey: string
  cssVarName: string
  defaultWidth: number
  min?: number
  max?: number
  side: ResizeSide
  containerRef?: React.RefObject<HTMLElement | null>
}

export function useResizableWidth(options: UseResizableOptions) {
  const { storageKey, cssVarName, defaultWidth, side, containerRef } = options
  const min = options.min ?? 240
  const max = options.max ?? 720

  const getInitial = () => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
    const parsed = saved ? parseInt(saved, 10) : NaN
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultWidth
  }

  const [width, setWidth] = useState<number>(getInitial)
  const resizingRef = useRef(false)

  const apply = useCallback(
    (w: number) => {
      const clamped = Math.min(Math.max(w, min), max)
      setWidth(clamped)
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(cssVarName, `${clamped}px`)
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, String(clamped))
      }
    },
    [cssVarName, max, min, storageKey],
  )

  useEffect(() => {
    apply(width)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingRef.current) return
      if (side === 'left') {
        apply(e.clientX)
      } else {
        const rightBoundary = containerRef?.current
          ? containerRef.current.getBoundingClientRect().right
          : window.innerWidth
        apply(rightBoundary - e.clientX)
      }
    },
    [apply, containerRef, side],
  )

  const stop = useCallback(() => {
    resizingRef.current = false
    if (typeof document !== 'undefined') {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [])

  const start = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      resizingRef.current = true
      if (typeof document !== 'undefined') {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', stop, { once: true })
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
      }
    },
    [onMouseMove, stop],
  )

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', stop)
    }
  }, [onMouseMove, stop])

  return { width, setWidth: apply, startResize: start }
}
