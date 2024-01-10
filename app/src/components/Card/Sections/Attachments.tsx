import React from 'react'
import { IFile } from '../../../types/File'
import { isEmpty } from 'lodash'

function FileTile({ file }: { file: IFile }) {
  switch (file.type) {
    case 'image':
      return <img src={file.url} className='w-full h-40 rounded-md' />
    default:
      null
  }
}

export default function Attachments({ files }: { files: IFile[] }) {
  return (
    <div className='flex flex-col'>
      {!isEmpty(files) ? (
        files.map((file) => <FileTile key={'f-' + file.id} file={file} />)
      ) : (
        <div className='text-gray-400'>No attachments here</div>
      )}
    </div>
  )
}
