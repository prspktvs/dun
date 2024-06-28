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
import { useChats } from '../../context/ChatContext/ChatContext'
import { IMessage } from '../../types/Chat'
import { useEditor } from '../../context/EditorContext/EditorContext'

export default function Chat({ chatId, users }: { chatId: string; users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const [messages, setMessages] = useState<IMessage[]>([])
  const { editor } = useEditor()
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
    await saveChatAndMessage({
      chatId,
      messageData: {
        text: newMessage,
        authorId: user?.id || '',
        timestamp: Date.now(),
      },
      content: 'Discussion',
      cardPath: `projects/${projectId}/cards/${cardId}`,
    })
    setNewMessage('')
  }
  return (
    <div className='h-[calc(100%-_56px)] flex flex-col'>
      <div
        className='underline font-monaspace hover:cursor-pointer p-3 border-b-2 border-border-color'
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
                <span className='font-rubik'>{message.text}</span>
              </div>
            )
          })
        ) : (
          <div className='text-gray-400 w-full text-center font-monaspace'>No messages here</div>
        )}
      </div>
      <div className='h-14 border-t-2 border-border-color px-1 flex items-center border-l-2  '>
        <Avatar size={22} src={user.avatarUrl} radius={0} />
        <input
          className='ml-1 h-8 w-full focus:outline-none'
          placeholder='Type a message...'
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
        />
        <button onClick={handleMessageSend}>
          <i className='ri-send-plane-2-line'></i>
        </button>
      </div>
    </div>
  )
}
