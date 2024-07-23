import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { IFile } from '../../../types/File'
import { isEmpty } from 'lodash'
import { RiArrowLeftSLine, RiArrowRightSLine, Minus, Plus, DownloadIcon } from '../../icons'
import { useDisclosure } from '@mantine/hooks'
import { usePreview } from '../../../context/FilePreviewContext'

interface IFileTileProps {
  file: IFile
  onClick: () => void
}
interface IAttachmentsProps {
  files: IFile[] | null
}

const stopPropagationWrapper =
  (handler: (event: React.MouseEvent<HTMLElement>) => void) =>
  (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handler(event)
  }

function FileTile({ file, onClick }: IFileTileProps) {
  return (
    <>
      {file.type === 'image' && (
        <img
          src={file.url}
          className='w-full h-40 rounded-md object-cover cursor-pointer border-1 border-border-color'
          onClick={onClick}
        />
      )}
    </>
  )
}

export default function Attachments({ files }: IAttachmentsProps) {
  const { setFileUrl } = usePreview()
  return (
    <div className='flex flex-col gap-2 p-3 h-[calc(100vh_-_164px)] overflow-y-scroll w-full'>
      {!isEmpty(files) && files ? (
        files.map((file) => (
          <FileTile key={'f-' + file.id} file={file} onClick={() => setFileUrl(file.url)} />
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
