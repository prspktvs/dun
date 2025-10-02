const functions = require('firebase-functions')
const fetch = require('node-fetch')
const admin = require('firebase-admin')

admin.initializeApp()

const API_HOST = process.env.FUNCTIONS_EMULATOR ? 'http://localhost:3000' : 'https://api.dun.wtf'

exports.onMessageCreated = functions
  .region('europe-west1')
  .database.ref('/projects/{projectId}/cards/{cardId}/chats/{chatId}/messages/{messageId}')
  .onCreate(async (snapshot, context) => {
    console.log('New message created', context.params)

    const msg = snapshot.val()
    const { projectId, cardId, chatId, messageId } = context.params

    const chatRef = admin
      .database()
      .ref(`/projects/${projectId}/cards/${cardId}/chats/${chatId}/messages`)
    const messagesSnapshot = await chatRef.once('value')
    const messages = messagesSnapshot.val()
    const messageCount = messages ? Object.keys(messages).length : 0
    const isFirstMessage = messageCount === 1

    const projectRef = admin.firestore().collection('projects').doc(projectId)
    const projectDoc = await projectRef.get()
    const project = projectDoc.exists ? projectDoc.data() : null

    console.log('Project data:', project)
    const projectUsersIds = project?.users ? project.users.map((u) => u.id) : []

    const data = {
      ...msg,
      projectId,
      cardId,
      chatId,
      messageId,
      isFirstMessage,
      projectUsersIds,
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
