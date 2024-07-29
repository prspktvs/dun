import 'dotenv/config.js'
import { bootstrapExpress } from './src/server.js'

process.on('uncaughtException', function (err) {
  console.log('uncaughtException', err)
})

async function bootstrap() {
  bootstrapExpress()
}

bootstrap()
