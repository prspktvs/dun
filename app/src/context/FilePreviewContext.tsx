import { createContext, useContext } from 'react'
import { useState } from 'react'
import { IFile } from '../types/File'
import FilePreviewModal from '../components/ui/modals/FilePreviewModal'

export const FilePreviewProvider = ({
  files,
  children,
}: {
  files: IFile[] | null
  children: React.ReactNode
}) => {
  const [fileUrl, setFileUrl] = useState<FilePreviewContext['fileUrl']>(undefined)

  const opened = Boolean(fileUrl)
  const onClose = () => setFileUrl(undefined)

  const contextValue: FilePreviewContext = {
    fileUrl,
    setFileUrl,
  }
  return (
    <FilePreviewContext.Provider value={contextValue}>
      {children}
      {!!fileUrl && (
        <FilePreviewModal opened={opened} onClose={onClose} fileUrl={fileUrl} files={files} />
      )}
    </FilePreviewContext.Provider>
  )
}

export type FilePreviewContext = {
  fileUrl: string | undefined
  setFileUrl: (url: string) => void
}

export const FilePreviewContext = createContext<FilePreviewContext | undefined>(undefined)

export const usePreview = (): FilePreviewContext => {
  const context = useContext(FilePreviewContext)
  if (!context) {
    throw new Error('usePreview must be used within a FilePreviewContext')
  }
  return context
}
