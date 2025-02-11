import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { isEmpty } from 'lodash'
import clsx from 'clsx'

import { IFile } from '../../../types/File'
import { RiArrowLeftSLine, RiArrowRightSLine, Minus, Plus, DownloadIcon } from '../../icons'

interface IAttachmentsProps {
  files: IFile[] | null
  fileUrl: string | undefined
  opened: boolean
  onClose: () => void
}

interface IFilePreview {
  file: IFile
  onClick: () => void
  isFullScreen?: boolean
}

const stopPropagationWrapper =
  (handler: (event: React.MouseEvent<HTMLElement>) => void) =>
  (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handler(event)
  }

export function FilePreview({ file, onClick, isFullScreen = true }: IFilePreview) { 
  switch (file.type) {
    case 'image':
      return (
        <Image
          src={file.url}
          className={clsx(
            'w-full h-full select-none',
            isFullScreen ? 'object-contain' : 'object-fit',
          )}
          alt='Dun project image preview'
          onClick={onClick}
        />
      )
    case 'video':
      return (
        <video
          src={file.url}
          className={clsx(
            'w-full h-full object-contain',
            isFullScreen ? 'object-contain' : 'object-fit',
          )}
          controls={isFullScreen}
          onClick={onClick}
        />
      )
    case 'link':
      return (
        <div className='h-full w-full flex items-center justify-center'>
          <a
            href={file.url}
            target='_blank'
            rel='noreferrer'
            className={clsx('bg-white rounded-md px-5 py-3', !isFullScreen && 'h-full w-full')}
          >
            {file.url}
          </a>
        </div>
      )
    default:
      return null
  }
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
      padding={0}
      m={0}
      onClick={onClose}
    >
      <div className='h-screen flex-1'>
        <div className='flex h-12 justify-center items-center gap-x-1 font-monaspace text-lg'>
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
            <div className='text-white select-none'>Download</div>
          </div>
        </div>
        <div className='flex h-[calc(100%_-_60px)] justify-center mt-2 items-center mb-0'>
          <RiArrowRightSLine onClick={stopPropagationWrapper(handlePrevious)} />

          <div className='flex justify-center items-center w-full h-full overflow-hidden'>
            <div style={{ transform: `scale(${scale / 100})`, width: '100%', height: '100%' }}>
              {selectedIndex !== null && !isEmpty(files) && (
                <FilePreview
                  file={files?.[selectedIndex]}
                  onClick={stopPropagationWrapper(() => {})}
                />
              )}
            </div>
          </div>

          <RiArrowLeftSLine onClick={stopPropagationWrapper(handleNext)} />
        </div>
      </div>
    </Modal>
  )
}
