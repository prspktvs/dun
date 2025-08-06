import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { isEmpty } from 'lodash'
import clsx from 'clsx'

import { IFile } from '../../../types/File'
import { RiArrowLeftSLine, RiArrowRightSLine, Minus, Plus, DownloadIcon, Cross } from '../../icons'

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

const getFileName = (url: string) => {
  const parts = decodeURIComponent(url).split('/o/files/')
  return parts.length > 1 ? parts[1].split('?')[0] : null
}

export function FilePreview({ file, onClick, isFullScreen = true }: IFilePreview) {
  switch (file.type) {
    case 'image':
      return (
        <div className='flex justify-center items-center w-full h-full'>
          <Image
            src={file.url}
            className='max-w-full max-h-full select-none object-contain'
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
            }}
            alt='Dun project image preview'
            onClick={onClick}
          />
        </div>
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
    case 'file':
      return isFullScreen ? (
        <object data={file.url} className='w-full h-full' style={{ width: '100%', height: '100%' }}>
          <p>
            <a href={file.url} target='_blank' rel='noopener noreferrer'>
              Download file
            </a>
          </p>
        </object>
      ) : (
        <div
          className='h-full w-full flex items-center justify-center px-3 hover:cursor-pointer hover:bg-hoverBox'
          onClick={onClick}
        >
          <p className='text-center'>{getFileName(file.url)}</p>
        </div>
      )
    case 'audio':
    case 'link':
      return isFullScreen ? (
        <iframe
          src={file.url}
          className='w-full h-full border-none'
          style={{ width: '100%', height: '100%' }}
          title='Link preview'
        />
      ) : (
        <div
          className='h-full w-full flex items-center justify-center hover:cursor-pointer hover:bg-hoverBox'
          onClick={onClick}
        >
          <a
            href={file.url}
            target='_blank'
            rel='noreferrer'
            className='bg-white rounded-md px-5 py-3 h-full w-full'
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
  const tempFile =
    !files?.length && fileUrl
      ? {
          id: 'temp',
          type:
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl) || fileUrl.includes('image')
              ? 'image'
              : 'file',
          url: fileUrl,
        }
      : null

  const workingFiles = files?.length ? files : tempFile ? [tempFile] : []
  const defaultIndex = workingFiles?.findIndex((f) => f.url === fileUrl) ?? 0
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
    if (workingFiles && selectedIndex !== null) {
      const nextIndex = (selectedIndex + 1) % workingFiles.length
      setSelectedIndex(nextIndex)
      setScale(100)
    }
  }

  const handlePrevious = () => {
    if (workingFiles && selectedIndex !== null) {
      const prevIndex = (selectedIndex - 1 + workingFiles.length) % workingFiles.length
      setSelectedIndex(prevIndex)
      setScale(100)
    }
  }

  const handleZoomIn = () => setScale((prev) => (prev < 200 ? prev + 10 : prev))

  const handleZoomOut = () => setScale((prev) => (prev > 50 ? prev - 10 : prev))

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

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
      <div className='relative h-screen flex-1'>
        <div className='absolute top-2 right-2 p-4 cursor-pointer' onClick={onClose}>
          <Cross />
        </div>
        <div className='flex h-12 justify-center items-center gap-x-1 font-monaspace text-lg'>
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleZoomOut()
            }}
            className='cursor-pointer'
          >
            <Minus />
          </div>
          <div className='text-white'>{scale}%</div>
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleZoomIn()
            }}
            className='cursor-pointer'
          >
            <Plus />
          </div>
          <div
            className='flex ml-5 gap-x-1 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation()
              if (selectedIndex !== null && workingFiles[selectedIndex]) {
                handleDownload(workingFiles[selectedIndex].url)
              }
            }}
          >
            <DownloadIcon />
            <div className='text-white select-none'>Download</div>
          </div>
        </div>
        <div className='flex h-[calc(100%_-_60px)] justify-center mt-2 items-center mb-0'>
          {workingFiles.length > 1 && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className='cursor-pointer text-white text-2xl p-4'
            >
              <RiArrowRightSLine />
            </div>
          )}

          <div
            className={`flex justify-center items-center w-full h-full overflow-hidden ${selectedIndex !== null && (workingFiles[selectedIndex]?.type === 'file' || workingFiles[selectedIndex]?.type === 'link') ? '' : 'px-4'}`}
          >
            <div
              style={{
                transform:
                  selectedIndex !== null &&
                  (workingFiles[selectedIndex]?.type === 'file' ||
                    workingFiles[selectedIndex]?.type === 'link')
                    ? 'none'
                    : `scale(${scale / 100})`,
                maxWidth:
                  selectedIndex !== null &&
                  (workingFiles[selectedIndex]?.type === 'file' ||
                    workingFiles[selectedIndex]?.type === 'link')
                    ? 'none'
                    : '100%',
                maxHeight:
                  selectedIndex !== null &&
                  (workingFiles[selectedIndex]?.type === 'file' ||
                    workingFiles[selectedIndex]?.type === 'link')
                    ? 'none'
                    : '100%',
                width:
                  selectedIndex !== null &&
                  (workingFiles[selectedIndex]?.type === 'file' ||
                    workingFiles[selectedIndex]?.type === 'link')
                    ? '100%'
                    : 'auto',
                height:
                  selectedIndex !== null &&
                  (workingFiles[selectedIndex]?.type === 'file' ||
                    workingFiles[selectedIndex]?.type === 'link')
                    ? '100%'
                    : 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {selectedIndex !== null && !isEmpty(workingFiles) && workingFiles && (
                <FilePreview file={workingFiles[selectedIndex]} onClick={() => {}} />
              )}
            </div>
          </div>

          {workingFiles.length > 1 && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className='cursor-pointer text-white text-2xl p-4'
            >
              <RiArrowLeftSLine />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
