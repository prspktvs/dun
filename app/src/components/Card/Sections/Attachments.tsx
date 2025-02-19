import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import { IFile } from '../../../types/File'
import { usePreview } from '../../../context/FilePreviewContext'
import { FilePreview } from '../../ui/modals/FilePreviewModal'

interface IAttachmentsProps {
  files: IFile[] | null
}

export default function Attachments({ files }: IAttachmentsProps) {
  const { setFileUrl } = usePreview()
  return (
    <section className='flex flex-col gap-2 p-3 h-[calc(100vh_-_164px)] overflow-y-scroll w-full'>
      {!isEmpty(files) && files ? (
        files.map((file) => (
          <div key={'f-' + file.id} className='h-40 border-1 rounded-md overflow-hidden'>
            <FilePreview file={file} onClick={() => setFileUrl(file.url)} isFullScreen={false} />
          </div>
        ))
      ) : (
        <div className='text-gray-400 font-monaspace'>No attachments yet</div>
      )}
    </section>
  )
}
