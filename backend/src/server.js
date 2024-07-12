import http from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import routes from './routes.js'
import { runQuery } from './database/index.js'
import {
  CREATE_CARDS_TABLE_QUERY,
  CREATE_FILES_TABLE_QUERY,
  CREATE_TASKS_TABLE_QUERY,
} from './database/queries.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(express.json())
app.use(cors({ origin: '*' }))
app.use('/api', routes)

async function bootstrapExpress() {
  await runQuery(CREATE_CARDS_TABLE_QUERY)
  await runQuery(CREATE_TASKS_TABLE_QUERY)
  await runQuery(CREATE_FILES_TABLE_QUERY)

  io.on('connection', (socket) => {
    // subscribers
    socket.on('subscribe', ({ userId }) => {
      socket.join(userId)
    })
    socket.on('joinProject', ({ projectId }) => {
      socket.join(projectId)
    })

    // unsubscribers
    socket.on('unsubscribe', ({ userId }) => {
      socket.leave(userId)
    })
    socket.on('leaveProject', ({ projectId }) => {
      socket.leave(projectId)
    })
  })

  const PORT = process.env.BACKEND_PORT || 4000
  server.listen(PORT, () => {
    console.log(`  > HTTP: Express server is running on ${PORT}`)
  })
}

export { bootstrapExpress, io }
