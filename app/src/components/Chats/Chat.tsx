import React, { useEffect, useState } from 'react'
import { db, realtimeDb } from '../../config/firebase'
import { onValue, push, ref, set, get } from '@firebase/database'
import { collection, doc, getDoc } from '@firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { IUser } from '../../types/User'
import { Avatar } from '@mantine/core'
import { isEmpty } from 'lodash'
import { saveChatAndMessage } from '../../services/chats'
import { useParams } from 'react-router-dom'
import { useChats } from '../../context/ChatContext/ChatContext'
import { IMessage } from '../../types/Chat'

export default function Chat({ chatId, users }: { chatId: string; users: IUser[] }) {
  const { id: projectId, cardId } = useParams()
  const [messages, setMessages] = useState<IMessage[]>([])
  const [content, setContent] = useState('Card discussion')
  const [newMessage, setNewMessage] = useState('')
  const { closeChat } = useChats()
  const { user } = useAuth()
  const chatUsers = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `chats/${chatId}`)
    onValue(messagesRef, (snapshot) => {
      const chat = snapshot.val()
      if (!chat?.messages) return setMessages([])
      const m: IMessage[] = Object.values(chat.messages)
      const mIds: string[] = Object.keys(chat.messages)
      if (!m || !mIds) return
      setMessages(m)
      setContent(chat.content)
      saveLastMessageId(mIds[mIds.length - 1])
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
    <div className='h-full flex flex-col'>
      <div
        className='underline hover:cursor-pointer p-3 border-b-2 border-gray-border'
        onClick={closeChat}
      >
        {'<'} Back to discussions
      </div>

      <div className='h-20 grow p-3 overflow-y-scroll'>
        {content ? (
          <div className='h-10 flex gap-3 mb-3 items-center'>
            <div className='h-full w-[2px] bg-black' />
            <div>{content}</div>
          </div>
        ) : null}
        {!isEmpty(messages) ? (
          messages.map((message, index) => {
            const messageUser = chatUsers[message.authorId]
            const date = new Date(message.timestamp)
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            const time = `${hours}:${minutes}`

            return (
              <div key={index}>
                <div className='flex gap-1 items-center font-semibold'>
                  <Avatar size={24} src={messageUser.avatarUrl} radius={0} />
                  <span>
                    {messageUser.name}
                    <span className='ml-3 text-sm text-gray-400 font-normal'>{time}</span>
                  </span>
                </div>
                <span>{message.text}</span>
              </div>
            )
          })
        ) : (
          <div className='text-gray-400 w-full text-center'>No messages here</div>
        )}
      </div>
      <div className='h-10 border-t-2 border-gray-border px-1 flex items-center'>
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
