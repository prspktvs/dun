const functions = require('firebase-functions')
const fetch = require('node-fetch')
const admin = require('firebase-admin')

admin.initializeApp()

const API_HOST = 'https://api.dun.wtf'

exports.onMessageCreated = functions.database
  .ref('/chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    console.log('New message created', context.params)

    const msg = snapshot.val()
    const { chatId, messageId } = context.params

    const chatRef = admin.database().ref(`/chats/${chatId}/messages`)
    const messagesSnapshot = await chatRef.once('value')
    const messages = messagesSnapshot.val()
    const messageCount = messages ? Object.keys(messages).length : 0
    const isFirstMessage = messageCount === 1

    const data = {
      ...msg,
      chatId,
      messageId,
      isFirstMessage,
    }

    try {
      const response = await fetch(`${API_HOST}/internal/chat/${chatId}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const json = await response.json()
      console.log('Notification sent successfully:', json)
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  })
