import express from 'express'
import cors from 'cors'
import expressWs from 'express-ws'
import { onStoreDocument } from './utils/util.js'
import { Server as HocusPocusServer } from '@hocuspocus/server'
import routes from './routes.js'
import { runQuery, sqliteExtension } from './database/index.js'
import { CREATE_TABLES_QUERIES, CREATE_ALL_INDEXES } from './database/queries.js'
import createPushAPI from './push.js'
import { getSendPushToChatFn } from './api/chats.js'

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

// @TODO: move to redis
const presence = {}

const app = express()
expressWs(app)
const hocusPocusServer = HocusPocusServer.configure({
  onStoreDocument: async (data) =>
    onStoreDocument({ data, broadcast: { sendMessageToProject, sendMessageToUser } }),
  async onAuthenticate(data) {
    const { token } = data

    // @TODO: verify token https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
    return {
      user: parseJwt(token),
    }
  },
  extensions: [sqliteExtension],
})

app.use(express.json())
app.use(cors({ origin: '*' }))
app.use((req, _, next) => {
  // parse token
  const token = req.headers.authorization?.split('Bearer ')[1] || req.query.token
  if (token) {
    req.user = parseJwt(token)
  }
  next()
})

app.use('/api', routes)

const clients = []
app.ws('/updates', (ws, req) => {
  const token = req.query.token
  const user = parseJwt(token)
  const userId = user.user_id
  const projectId = req.query.projectId

  clients.push({ ws, userId, projectId })
  presence[userId] = clients[client.length - 1]

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1)
    delete presence[userId]
  })
})

app.ws('/collaboration', (websocket, request) => {
  hocusPocusServer.handleConnection(websocket, request)
})

const sendNotification = createPushAPI(app, '/push/')
const sentPushToChat = getSendPushToChatFn(sendNotification)

app.post('/internal/chat/:chatId', sentPushToChat)

export function sendMessageToUser(userId, message) {
  // @TODO: add all other types of notifications
  const { cardId, projectId } = message
  const updatedTasks = message.updatedTasks.map((task) => task.text)
  const mentions = message.mentions.map((m) => m.text)

  if (updatedTasks.length > 0) {
    sendNotification(userId, {
      title: 'Tasks updated',
      body: `Tasks: ${updatedTasks.join(', ')} have been updated`,
      data: { cardId, projectId, tasks: message.updatedTasks },
    })
  }

  if (mentions.length > 0) {
    sendNotification(userId, {
      title: 'Mentions',
      body: `You have been mentioned in: ${mentions.join(', ')}`,
      data: { cardId, projectId, mentions: message.mentions },
    })
  }

  clients.forEach((client) => {
    if (client.userId === userId) {
      client.ws.send(JSON.stringify(message))
    }
  })
}

export function sendMessageToProject(projectId, message) {
  clients.forEach((client) => {
    if (client.projectId === projectId) {
      client.ws.send(JSON.stringify(message))
    }
  })
}

export async function bootstrapExpress() {
  await Promise.all(CREATE_TABLES_QUERIES.map((q) => runQuery(q)))
  await Promise.all(CREATE_ALL_INDEXES.map((q) => runQuery(q)))

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`  > HTTP: Express server is running on ${PORT}`)
  })
}
