import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { IFile } from '../../../types/File'
import { isEmpty } from 'lodash'
import { RiArrowLeftSLine, RiArrowRightSLine, Minus, Plus, DownloadIcon } from '../../icons'

interface IAttachmentsProps {
  files: IFile[] | null
  fileUrl: string | undefined
  opened: boolean
  onClose: () => void
}

const stopPropagationWrapper =
  (handler: (event: React.MouseEvent<HTMLElement>) => void) =>
  (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handler(event)
  }

export default function FilePreviewModal({ opened, onClose, files, fileUrl }: IAttachmentsProps) {
  const defaultIndex = files?.findIndex((f) => f.url === fileUrl) ?? 0
  const [selectedIndex, setSelectedIndex] = useState<number | null>(defaultIndex)
  const [scale, setScale] = useState<number>(100)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') return handleNext()
      if (e.key === 'ArrowLeft') return handlePrevious()
      if (e.key === 'Escape') return onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, files])

  const handleNext = () => {
    if (files && selectedIndex !== null) {
      const nextIndex = (selectedIndex + 1) % files.length
      setSelectedIndex(nextIndex)
      setScale(100)
    }
  }

  const handlePrevious = () => {
    if (files && selectedIndex !== null) {
      const prevIndex = (selectedIndex - 1 + files.length) % files.length
      setSelectedIndex(prevIndex)
      setScale(100)
    }
  }

  const handleZoomIn = () => setScale((prev) => (prev < 200 ? prev + 10 : prev))

  const handleZoomOut = () => setScale((prev) => (prev > 50 ? prev - 10 : prev))

  const handleDownload = (url: string) => window.open(url, '_blank')

  return (
    <Modal
      styles={{ content: { backgroundColor: 'rgba(0, 0, 0, 0.6)' } }}
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      fullScreen
      onClick={onClose}
    >
      <div className='flex justify-center items-center gap-x-1 my-3 font-monaspace text-lg'>
        <Minus onClick={stopPropagationWrapper(handleZoomOut)} />
        <div className='text-white'>{scale}%</div>
        <Plus onClick={stopPropagationWrapper(handleZoomIn)} />
        <div
          className='flex ml-5 gap-x-1 cursor-pointer'
          onClick={() =>
            selectedIndex !== null &&
            stopPropagationWrapper(handleDownload(files[selectedIndex].url))
          }
        >
          <DownloadIcon />
          <div className='text-white'>Download</div>
        </div>
      </div>
      <div className='flex justify-center mt-2 items-center mb-10 gap-3'>
        <RiArrowRightSLine onClick={stopPropagationWrapper(handlePrevious)} />

        <div className='flex justify-center items-center w-full h-[560px] overflow-hidden'>
          <div style={{ transform: `scale(${scale / 100})`, width: '100%', height: '100%' }}>
            {selectedIndex !== null && !isEmpty(files) && (
              <Image
                src={files?.[selectedIndex].url}
                alt='Dun selected attachment'
                className='w-full h-full object-contain select-none'
                onClick={stopPropagationWrapper(() => {})}
              />
            )}
          </div>
        </div>

        <RiArrowLeftSLine onClick={stopPropagationWrapper(handleNext)} />
      </div>
    </Modal>
  )
}
