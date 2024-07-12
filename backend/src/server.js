// import http from 'http'
import express from 'express'
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

const hocusPocusServer = HocusPocusServer.configure({
  // onStoreDocument,
  onConnect: (context) => {
    console.log('On connect')
  },
  extensions: [sqliteExtension],
})

const app = express()
expressWs(app)
// const server = http.createServer(app)
// const io = new Server(server, { cors: { origin: '*' } })
const io = {}

app.use(express.json())
app.use(cors({ origin: '*' }))
app.use('/api', routes)

app.ws('/collaboration', (websocket, request) => {
  const context = {
    user: {
      id: 1234,
      name: 'Jane',
    },
  }
  console.log('websocket connection')

  hocusPocusServer.handleConnection(websocket, request, context)
})

async function bootstrapExpress() {
  await runQuery(CREATE_CARDS_TABLE_QUERY)
  await runQuery(CREATE_TASKS_TABLE_QUERY)
  await runQuery(CREATE_FILES_TABLE_QUERY)

  // io.on('connection', (socket) => {
  //   // subscribers

  //   socket.on('subscribe', ({ userId }) => {
  //     socket.join(userId)
  //   })
  //   socket.on('joinProject', ({ projectId }) => {
  //     socket.join(projectId)
  //   })

  //   // unsubscribers
  //   socket.on('unsubscribe', ({ userId }) => {
  //     socket.leave(userId)
  //   })
  //   socket.on('leaveProject', ({ projectId }) => {
  //     socket.leave(projectId)
  //   })
  // })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`  > HTTP: Express server is running on ${PORT}`)
  })
}

export { bootstrapExpress, io }
