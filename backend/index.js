import { Hocuspocus } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'
import { sqliteExtension } from './src/database/index.js'
import { onStoreDocument } from './src/utils/util.js'
import { bootstrapExpress } from './src/server.js'

process.on('uncaughtException', function (err) {
  console.log('uncaughtException', err)
})

const hocusPocusServer = new Hocuspocus({
  port: process.env.HOCUSPOCUS_PORT || 3000,
  extensions: [
    // new Logger(),
    sqliteExtension,
  ],
  onStoreDocument,
})

async function bootstrap() {
  await hocusPocusServer.listen()

  bootstrapExpress()
}

bootstrap()
