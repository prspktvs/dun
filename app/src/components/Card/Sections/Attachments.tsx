import React, { useEffect, useState } from 'react'
import { Modal, Image } from '@mantine/core'
import { isEmpty } from 'lodash'
import { useDisclosure } from '@mantine/hooks'

import { IFile } from '../../../types/File'
import { RiArrowLeftSLine, RiArrowRightSLine, Minus, Plus, DownloadIcon } from '../../icons'
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
    <section className='flex flex-col gap-2 p-3 h-[calc(100vh_-_164px)] overflow-y-scroll w-full'>
      {!isEmpty(files) && files ? (
        files.map((file) => (
          <FileTile key={'f-' + file.id} file={file} onClick={() => setFileUrl(file.url)} />
        ))
      ) : (
        <div className='text-gray-400 font-monaspace'>No attachments yet</div>
      )}
    </section>
  )
}
