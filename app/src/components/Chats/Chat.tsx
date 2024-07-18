import React, { useEffect, useLayoutEffect, useState } from 'react'
import { db, realtimeDb } from '../../config/firebase'
import { onValue, push, ref, set, get } from '@firebase/database'
import { collection, doc, getDoc } from '@firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User'
import { Avatar } from '@mantine/core'
import { isEmpty } from 'lodash'
import { saveChatAndMessage } from '../../services'
import { useParams } from 'react-router-dom'
import { useChats } from '../../context/ChatContext'
import { IMessage } from '../../types/Chat'
import { useEditor } from '../../context/EditorContext'

import { MentionsInput, Mention } from 'react-mentions'
import { useProject } from '../../context/ProjectContext'

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

    return part
  })

  return renderedParts
}

export function Chat({ chatId, users }: { chatId: string; users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const [messages, setMessages] = useState<IMessage[]>([])
  const { editor } = useEditor()
  const { project } = useProject()
  const [content, setContent] = useState('Card discussion')
  const [newMessage, setNewMessage] = useState('')
  const { closeChat } = useChats()
  const { user } = useAuth()
  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
  const chatRef = React.useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats/${chatId}`)
    onValue(messagesRef, (snapshot) => {
      const chat = snapshot.val()
      console.log(chat)

      if (editor && !isEmpty(editor.topLevelBlocks)) {
        const block = editor.topLevelBlocks.find((block) => block.id === chat.id)

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
    })
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
    if (newMessage === '') return alert('Message cannot be empty')

    let mentions: string[] = []
    newMessage.split(mentionsPattern).forEach((part, index) => {
      if (index % 3 === 1) {
        const id = newMessage.split(mentionsPattern)[index + 1]
        mentions.push(id)
      }
    })

    await saveChatAndMessage({
      chatId,
      messageData: {
        text: newMessage,
        authorId: user?.id || '',
        timestamp: Date.now(),
        mentions,
      },
      content: 'Discussion',
      cardId,
    })
    setNewMessage('')
  }

  return (
    <div className='h-[calc(100%-_56px)] flex flex-col'>
      <div
        className='underline font-monaspace hover:cursor-pointer p-3 border-b-1 border-border-color'
        onClick={closeChat}
      >
        {'<'} Back to discussions
      </div>

      <div ref={chatRef} className='h-20 grow p-3 space-y-1 hide-scrollbar overflow-y-scroll'>
        {content ? (
          <div className='h-10 flex gap-3 mb-3 items-center font-monaspace'>
            <div className='h-full w-[3px] bg-gray-500' />
            <div>{content}</div>
          </div>
        ) : null}
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
              <div key={index} className='w-full '>
                {isAnotherDay ? (
                  <span className='flex justify-center text-gray-400 font-monaspace mb-3'>
                    {dayMessage}
                  </span>
                ) : null}
                <div className='flex gap-1 items-center font-semibold'>
                  <Avatar size={24} src={messageUser.avatarUrl} radius={0} />
                  <span className='font-rubik'>
                    {messageUser.name}
                    <span className='ml-3 text-sm text-gray-400 font-monaspace font-thin'>
                      {time}
                    </span>
                  </span>
                </div>
                <span className='font-rubik'>{renderMessage(message.text)}</span>
              </div>
            )
          })
        ) : (
          <div className='text-gray-400 w-full text-center font-monaspace'>No messages here</div>
        )}
      </div>
      <div className='h-14 border-t-1 border-border-color px-1 flex items-center'>
        <Avatar size={22} src={user.avatarUrl} radius={0} />
        <MentionsInput
          singleLine
          className='ml-1 w-full'
          style={{
            '&multiLine': {
              input: { outline: 0, border: 0 },
            },
            '&singleLine': { input: { outline: 0, border: 0 } },
          }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Type a message...'
          forceSuggestionsAboveCursor={true}
        >
          <Mention
            className='mention z-10 bg-white relative'
            trigger='@'
            data={project.users?.map((user) => ({ id: user.id, display: user.name }))}
            displayTransform={(id, display) => {
              return `@${display}`
            }}
            renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
              return (
                <div
                  className={`block w-full text-left p-1 ${
                    focused ? 'bg-purple-500 text-white border-none' : 'bg-purple-300 border-none'
                  }`}
                >
                  {'@' + suggestion.display}
                </div>
              )
            }}
          />
        </MentionsInput>
        <button onClick={handleMessageSend}>
          <i className='ri-send-plane-2-line'></i>
        </button>
      </div>
    </div>
  )
}
