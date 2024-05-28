import React, { useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { IFile } from '../../../types/File'
import { isEmpty } from 'lodash'
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  Minus,
  Plus,
  DownloadIcon,
} from '../../Project/Content/IconsCard'
import { useDisclosure } from '@mantine/hooks'

function FileTile({ file, onClick }: { file: IFile; onClick: () => void }) {
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

export default function Attachments({ files }: { files: IFile[] | null }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    open()
  }

  const handleNext = () => {
    if (files && selectedIndex !== null) {
      const nextIndex = (selectedIndex + 1) % files.length
      setSelectedIndex(nextIndex)
    }
  }

  const handlePrevious = () => {
    if (files && selectedIndex !== null) {
      const prevIndex = (selectedIndex - 1 + files.length) % files.length
      setSelectedIndex(prevIndex)
    }
  }

  return (
    <div className='flex flex-col gap-2 p-3'>
      <Modal
        styles={{ content: { backgroundColor: 'black' } }}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size='auto'
        overlayProps={{
          backgroundOpacity: 0.8,
        }}
      >
        <div className='flex justify-center items-center gap-x-1 my-3 font-monaspace text-lg '>
          <Minus />
          <div className='text-white'>100%</div>
          <Plus />
          <div className='flex ml-5 gap-x-1'>
            <DownloadIcon />
            <div className='text-white'>Download</div>
          </div>
        </div>
        <div className='flex justify-center mt-2 items-center gap-x-10 mb-10'>
          <RiArrowRightSLine onClick={handleNext} className='cursor-pointer text-white' />

          <div className='w-fit'>
            {selectedIndex !== null && files && (
              <Image
                src={files[selectedIndex].url}
                alt='Selected attachment'
                className='h-[600px]'
              />
            )}
          </div>
          <RiArrowLeftSLine onClick={handlePrevious} className='cursor-pointer text-white' />
        </div>
      </Modal>

      {!isEmpty(files) && files ? (
        files.map((file, index) => (
          <FileTile key={'f-' + file.id} file={file} onClick={() => handleImageClick(index)} />
        ))
      ) : (
        <div className='text-gray-400 font-monaspace'>No attachments yet</div>
      )}
    </div>
  )
}
