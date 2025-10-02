import React, { useEffect, useLayoutEffect, useState } from 'react'
import { onValue, ref, off } from '@firebase/database'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions'

import { realtimeDb } from '../../config/firebase'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User'
import { saveChatAndMessage } from '../../services'
import { useChats } from '../../context/ChatContext'
import { IMessage, IAttachment } from '../../types/Chat'
import { useEditor } from '../../context/EditorContext'
import { useProject } from '../../context/ProjectContext'
import { usePreview } from '../../context/FilePreviewContext'
import { useCardFiles } from '../../context/CardFilesContext'
import AvatarDun from '../ui/Avatar'
import { getChatPath } from '../../utils/chat'
import { updateReadBy } from '../../services/chat.service'
import { uploadFile } from '../../services/upload.service'
import { genId } from '../../utils'

export const mentionsPattern = /@\[(.*?)\]\((.*?)\)/g

export const renderMessage = (message: string) => {
  const mentionRegex = /(@\[.*?\]\(.*?\))/g
  const parts = message.split(mentionRegex)

  const renderedParts = parts.map((part, index) => {
    const match = part.match(/@\[(.*?)\]\((.*?)\)/)
    if (match) {
      const [, name, id] = match
      return (
        <span key={'mention-id-' + id} className='mention'>
          @{name}
        </span>
      )
    }

    return part.split('\n').map((line, i) => (
      <React.Fragment key={`line-${index}-${i}`}>
        {line}
        {i !== part.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  })

  return renderedParts
}

export function Chat({ chatId, users }: { chatId: string; users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const [messages, setMessages] = useState<IMessage[]>([])
  const { editor } = useEditor()
  const { project } = useProject()
  const { setFileUrl } = usePreview()
  const { addFiles } = useCardFiles()
  const [content, setContent] = useState('Discussion')
  const [newMessage, setNewMessage] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { closeChat } = useChats()
  const { user } = useAuth()
  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
  const chatRef = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const firstMessage = messages[0]
  const author = firstMessage?.author

  useLayoutEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const messagesRef = ref(realtimeDb, getChatPath(projectId, cardId, chatId))
    onValue(messagesRef, (snapshot) => {
      const chat = snapshot.val()

      if (editor && !isEmpty(editor.topLevelBlocks)) {
        const block = editor.topLevelBlocks.find((block) => block.id === chatId)

        setContent(block?.content?.[0]?.text)
      } else {
        setContent(chat?.content)
      }

      if (!chat?.messages) return setMessages([])
      const m: IMessage[] = Object.values(chat.messages)
      const mIds: string[] = Object.keys(chat.messages)
      if (!m || !mIds) return
      setMessages(m)
      if (editor) saveLastMessageId(mIds[mIds.length - 1])

      updateReadBy(getChatPath(projectId, cardId, chatId), user.id)
    })

    return () => off(messagesRef)
  }, [chatId])

  const saveLastMessageId = (messageId: string) => {
    localStorage.setItem(
      'lastReadMessages',
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('lastReadMessages') || '{}'),
        [chatId]: messageId,
      }),
    )
  }

  const handleMessageSend = async () => {
    if (newMessage === '' && uploadingFiles.length === 0) return alert('Message cannot be empty')

    setIsUploading(true)
    const mentions: string[] = []

    newMessage.split(mentionsPattern).forEach((part, index) => {
      if (index % 3 === 1) {
        const id = newMessage.split(mentionsPattern)[index + 1]
        mentions.push(id)
      }
    })

    const attachments: IAttachment[] = []
    const failedUploads: string[] = []

    for (const file of uploadingFiles) {
      try {
        const url = await uploadFile(file)
        if (url) {
          attachments.push({
            url,
            name: file.name,
            type: file.type,
            size: file.size,
          })
        } else {
          failedUploads.push(file.name)
        }
      } catch {
        failedUploads.push(file.name)
      }
    }

    const messageData: IMessage = {
      text: newMessage,
      author: user?.name || '',
      authorId: user?.id || '',
      timestamp: Date.now(),
      mentions,
      readBy: [user?.id || ''],
      ...(attachments.length > 0 && { attachments }),
    }

    await saveChatAndMessage({
      path: getChatPath(projectId, cardId, chatId),
      messageData,
      content: 'Discussion',
    })

    if (attachments.length > 0) {
      const files = attachments.map((attachment) => ({
        id: genId(),
        type: attachment.type.startsWith('image/')
          ? 'image'
          : attachment.type.startsWith('video/')
            ? 'video'
            : 'file',
        url: attachment.url,
      }))

      try {
        await addFiles(files)
      } catch {}
    }

    setNewMessage('')
    setUploadingFiles([])
    setIsUploading(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    const maxFiles = 10
    const currentCount = uploadingFiles.length
    const availableSlots = maxFiles - currentCount

    if (files.length > availableSlots) {
      alert(
        `Maximum ${maxFiles} files allowed. You have ${currentCount} files, can add ${availableSlots} more.`,
      )
      return
    }

    setUploadingFiles((prev) => [...prev, ...files])

    if (event.target) {
      event.target.value = ''
    }
  }

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderAttachment = (attachment: IAttachment) => {
    const isImage = attachment.type.startsWith('image/')
    const isVideo = attachment.type.startsWith('video/')
    const isAudio = attachment.type.startsWith('audio/')
    const fileExtension = attachment.name.split('.').pop()?.toUpperCase() || ''

    const getFileIcon = () => {
      if (isVideo) return 'ri-video-line'
      if (isAudio) return 'ri-music-line'
      if (attachment.type.includes('pdf')) return 'ri-file-pdf-line'
      if (
        attachment.type.includes('zip') ||
        attachment.type.includes('rar') ||
        attachment.type.includes('7z')
      )
        return 'ri-file-zip-line'
      if (attachment.type.includes('word') || fileExtension === 'DOC' || fileExtension === 'DOCX')
        return 'ri-file-word-line'
      if (attachment.type.includes('excel') || fileExtension === 'XLS' || fileExtension === 'XLSX')
        return 'ri-file-excel-line'
      if (
        attachment.type.includes('powerpoint') ||
        fileExtension === 'PPT' ||
        fileExtension === 'PPTX'
      )
        return 'ri-file-ppt-line'
      if (attachment.type.includes('javascript') || fileExtension === 'JS') return 'ri-braces-line'
      if (attachment.type.includes('typescript') || fileExtension === 'TS') return 'ri-braces-line'
      if (attachment.type.includes('html') || fileExtension === 'HTML') return 'ri-code-line'
      if (attachment.type.includes('css') || fileExtension === 'CSS') return 'ri-palette-line'
      if (attachment.type.includes('json') || fileExtension === 'JSON') return 'ri-brackets-line'
      return 'ri-file-line'
    }

    return (
      <div
        className='w-16 h-16 rounded-lg cursor-pointer hover:opacity-80 bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center relative overflow-hidden'
        onClick={() =>
          isImage ? setFileUrl(attachment.url) : window.open(attachment.url, '_blank')
        }
      >
        {isImage ? (
          <img
            src={attachment.url}
            alt='Attached image'
            className='w-full h-full object-cover rounded-lg'
          />
        ) : (
          <div className='flex flex-col items-center justify-center text-gray-600'>
            <i className={`${getFileIcon()} text-lg mb-1`} />
            <div className='text-xs text-center leading-none'>{fileExtension}</div>
          </div>
        )}

        {/* File size indicator for non-images */}
        {!isImage && attachment.size && (
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5'>
            {formatFileSize(attachment.size)}
          </div>
        )}
      </div>
    )
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        setNewMessage((prev) => prev + '\n')
      } else {
        e.preventDefault()
        handleMessageSend()
      }
    }
  }

  return (
    <div className='h-[calc(100vh-_90px)] md:h-[calc(100vh-_168px)] flex flex-col'>
      <div
        className='flex gap-3 items-center font-monaspace px-3 hover:cursor-pointer border-b-1 border-borders-purple'
        onClick={closeChat}
      >
        <div className='text-2xl font-bold'>{'<'}</div>
        <div>
          <div className='h-full border-l-1 border-borders-purple px-2 py-1 gap-3 font-monaspace'>
            <div className='text-sm text-[#A3A1A7]'>
              {author ? `${author} started a discussion about:` : 'New discussion:'}
            </div>
            <div className='text-sm'>{content || 'Discussion'}</div>
          </div>
        </div>
      </div>

      <div ref={chatRef} className='h-20 grow p-3 space-y-1 hide-scrollbar overflow-y-scroll'>
        {!isEmpty(messages) ? (
          messages.map((message, index) => {
            const messageUser = chatUsers[message.authorId]
            const date = new Date(message.timestamp)
            const isAnotherDay =
              new Date(messages[index - 1]?.timestamp).getDate() !== date.getDate()
            const day = date.toLocaleString('en-US', { day: 'numeric' })
            const month = date.toLocaleString('en-US', { month: 'long' })
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const time = `${hours}:${minutes}`

            const dayMessage =
              date.toDateString() === new Date().toDateString() ? 'Today' : `${day} ${month}`

            return (
              <div key={index} className='w-full'>
                {isAnotherDay ? (
                  <div className='flex justify-center text-xs text-gray-400 font-monaspace my-2'>
                    <span className='border-[0.5px] py-[2px] px-1 rounded-sm'>{dayMessage}</span>
                  </div>
                ) : null}
                <div className='flex gap-1 items-center font-semibold'>
                  <AvatarDun user={messageUser} size={24} />
                  <span className='font-rubik text-14 font-medium ml-1'>
                    {messageUser?.name}
                    <span className='ml-2 text-sm text-gray-400 font-monaspace font-thin'>
                      {time}
                    </span>
                  </span>
                </div>
                <div className='ml-8 mb-5'>
                  <span className='whitespace-normal break-words font-commissioner'>
                    {renderMessage(message.text)}
                  </span>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {message.attachments.map((attachment, attachIndex) => (
                        <div key={attachIndex}>{renderAttachment(attachment)}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className='text-gray-400 w-full text-center font-monaspace'>No messages here</div>
        )}
      </div>

      {/* File upload preview */}
      {uploadingFiles.length > 0 && (
        <div className='border-t-1 border-borders-purple px-3 py-2 bg-gray-50'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-xs text-gray-600'>Files to upload ({uploadingFiles.length}):</div>
            <button
              onClick={() => setUploadingFiles([])}
              className='text-xs text-red-500 hover:text-red-700'
            >
              Clear all
            </button>
          </div>
          <div className='space-y-1'>
            {uploadingFiles.map((file, index) => (
              <div key={index} className='flex items-center gap-2 text-sm'>
                <i className='ri-file-line' />
                <span className='flex-1 truncate'>{file.name}</span>
                <span className='text-xs text-gray-500'>{formatFileSize(file.size)}</span>
                <button
                  onClick={() => removeFile(index)}
                  className='text-red-500 hover:text-red-700'
                >
                  <i className='ri-close-line' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='min-h-14 border-t-1 border-borders-purple px-1 flex w-full items-center'>
        <AvatarDun user={user as IUser} />
        <input
          ref={fileInputRef}
          type='file'
          multiple
          onChange={handleFileSelect}
          className='hidden'
          accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.zip,.rar,.7z,.tar,.gz,.js,.ts,.html,.css,.json,.xml,.svg'
        />
        <MentionsInput
          className='ml-1 flex-1 font-commissioner max-h-[200px] w-3/4'
          style={{
            input: {
              outline: 0,
              border: 0,
              resize: 'none',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            },
            highlighter: {
              overflow: 'hidden',
            },
            suggestions: {
              borderRadius: 8,
              border: '1px solid #000',
            },
          }}
          onKeyDown={handleKeyDown}
          value={newMessage}
          singleLine={false}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Your comment'
          forceSuggestionsAboveCursor
        >
          <Mention
            trigger='@'
            data={
              users?.map((user) => ({
                id: user.id,
                display: user.name,
              })) as SuggestionDataItem[]
            }
            displayTransform={(id, display) => {
              return `@${display}`
            }}
            renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
              return (
                <div
                  className={`block w-full text-left p-1 ${
                    focused
                      ? 'text-black font-bold border-1 border-black rounded-md'
                      : 'border-none'
                  }`}
                >
                  {'@' + suggestion.display}
                </div>
              )
            }}
          />
        </MentionsInput>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`text-xl mr-1 relative ${uploadingFiles.length > 0 ? 'text-blue-600' : ''}`}
          title={`Attach files${uploadingFiles.length > 0 ? ` (${uploadingFiles.length})` : ''}`}
        >
          <i className='ri-attachment-2' />
          {uploadingFiles.length > 0 && (
            <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
              {uploadingFiles.length}
            </span>
          )}
        </button>
        <button
          onClick={handleMessageSend}
          disabled={isUploading}
          className={`text-xl ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <i className='ri-loader-4-line animate-spin' />
          ) : (
            <i className='ri-send-plane-2-line' />
          )}
        </button>
      </div>
    </div>
  )
}
