// import http from 'http'
import express from 'express'
import http from 'http'
import cors from 'cors'
import expressWs from 'express-ws'
import { onStoreDocument } from './utils/util.js'
import { Server } from 'socket.io'
import { Server as HocusPocusServer } from '@hocuspocus/server'
import routes from './routes.js'
import { runQuery, sqliteExtension } from './database/index.js'
import {
  CREATE_CARDS_TABLE_QUERY,
  CREATE_FILES_TABLE_QUERY,
  CREATE_TASKS_TABLE_QUERY,
} from './database/queries.js'

const app = express()
expressWs(app)
const hocusPocusServer = HocusPocusServer.configure({
  onStoreDocument: async (data) =>
    onStoreDocument({ data, broadcast: { sendMessageToProject, sendMessageToUser } }),
  extensions: [sqliteExtension],
})

app.use(express.json())
app.use(cors({ origin: '*' }))
app.use('/api', routes)

const clients = []
app.ws('/updates', (ws, req) => {
  const userId = req.query.userId
  const projectId = req.query.projectId

  clients.push({ ws, userId, projectId })

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1)
  })
})

app.ws('/collaboration', (websocket, request) => {
  hocusPocusServer.handleConnection(websocket, request)
})

export function sendMessageToUser(userId, message) {
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
  await runQuery(CREATE_CARDS_TABLE_QUERY)
  await runQuery(CREATE_TASKS_TABLE_QUERY)
  await runQuery(CREATE_FILES_TABLE_QUERY)

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`  > HTTP: Express server is running on ${PORT}`)
  })
}
