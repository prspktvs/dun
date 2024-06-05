import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { IFile } from '../../../types/File'
import { isEmpty } from 'lodash'
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  Minus,
  Plus,
  DownloadIcon,
} from '../../icons'
import { useDisclosure } from '@mantine/hooks'


interface IFileTileProps {
  file: IFile
  onClick: () => void
}
interface IAttachmentsProps {
  files: IFile[] | null
}

function FileTile({ file, onClick }: IFileTileProps){
  return (
    <>
      {file.type === 'image' && (
        <img
          src={file.url}
          className='w-full h-40 rounded-md object-cover cursor-pointer'
          onClick={onClick}
        />
      )}
    </>
  )
}

export default function Attachments({ files }: IAttachmentsProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [scale, setScale] = useState<number>(100)

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') return handleNext()
      if (e.key === 'ArrowLeft') return handlePrevious()
      if (e.key === 'Escape') return close()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, files])

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    open()
  }

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

  const handleZoomIn = () => setScale((prev) => prev < 200 ? prev + 10 : prev)

  const handleZoomOut = () => setScale((prev) => prev > 50 ? prev - 10 : prev)

  const handleDownload = (url: string) => window.open(url, '_blank')

  return (
    <div className='flex flex-col gap-2 p-3 h-[calc(100vh_-_164px)] overflow-y-scroll w-full'>
      {!isEmpty(files) && files ? (
        files.map((file, index) => (
          <FileTile key={'f-' + file.id} file={file} onClick={() => handleImageClick(index)} />
        ))
      ) : (
        <div className='text-gray-400 font-monaspace'>No attachments yet</div>
      )}
      <Modal
        styles={{ content: { backgroundColor: 'black' } }}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size='100%'
        overlayProps={{
          backgroundOpacity: 0.8,
        }}
      >
        <div className='flex justify-center items-center gap-x-1 my-3 font-monaspace text-lg '>
          <Minus onClick={handleZoomOut} />
          <div className='text-white'>{scale}%</div>
          <Plus onClick={handleZoomIn} />
          <div
            className='flex ml-5 gap-x-1 cursor-pointer'
            onClick={() => selectedIndex !== null && handleDownload(files[selectedIndex].url)}
          >
            <DownloadIcon />
            <div className='text-white'>Download</div>
          </div>
        </div>
        <div className='flex justify-center mt-2 items-center mb-10'>
          <RiArrowRightSLine onClick={handlePrevious}/>

          <div className='flex justify-center items-center w-full h-[560px] overflow-hidden'>
            <div style={{ transform: `scale(${scale / 100})`, width: '100%', height: '100%' }}>
              {selectedIndex !== null && !isEmpty(files) && (
                <Image
                  src={files?.[selectedIndex].url}
                  alt='Dun selected attachment'
                  className='w-full h-full object-contain select-none'
                />
              )}
            </div>
          </div>

          <RiArrowLeftSLine onClick={handleNext} />
        </div>
      </Modal>
    </div>
  )
}
