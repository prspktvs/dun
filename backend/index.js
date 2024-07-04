import { Hocuspocus, Server } from '@hocuspocus/server'
import { Redis } from "@hocuspocus/extension-redis";
import { Logger } from "@hocuspocus/extension-logger";
import { TiptapTransformer } from '@hocuspocus/transformer'
import { db } from './firebase.js'
import * as Y from 'yjs'
import Mention from '@tiptap/extension-mention'
import { getBlockNoteExtensions, defaultBlockSchema } from '@blocknote/core'
import { TaskBlock } from './nodes/Task.js'
import { ImageBlock } from './nodes/Image.js'
import parser from './parser.js'

const customSchema = {
  ...defaultBlockSchema,
  task: TaskBlock,
  image: ImageBlock,
}

const onConnect = async (data) => {
  // console.log(data.socketId, ' is connected.')
}

const onLoadDocument = async (data) => {
  try {
    const path = `projects/${data.documentName}`
    const res = await db.doc(path).get()
    const doc = res?.data()?.document
    if (doc) {
      const yDoc = TiptapTransformer.toYdoc(doc, 'document-store', [
        Mention,
        ...getBlockNoteExtensions({
          blockSchema: customSchema,
          domAttributes: {
            blockContainer: 'div',
            blockGroup: 'div',
          },
        }),
      ])

      return yDoc
    }

    return new Y.Doc()
  } catch (e) {
    console.error('> Error in onLoadDocument:\n', e)
  }
}

// calls after onChange with debounce https://tiptap.dev/hocuspocus/server/hooks#on-store-document
const onStoreDocument = async (data) => {
  try {
    const json = TiptapTransformer.fromYdoc(data.document, 'document-store')
    const path = `projects/${data.documentName}`
    // console.log(JSON.stringify(json, null, 2))

    const prevTasksRef = db.collection(path + '/tasks')
    const snapshot = await prevTasksRef.get()
    const prevTasks = []
    snapshot.forEach((doc) => {
      prevTasks.push(doc.data())
    })

    const { allTasks, allFiles, description } = parser(json)

    const batch = db.batch()

    batch.update(db.doc(path), {
      document: json,
      files: allFiles,
      description,
    }) // save Y.Doc

    prevTasks
      .filter((task) => !allTasks.includes(task.id))
      .forEach((task) => {
        batch.delete(db.doc(path + `/tasks/${task.id}`))
      })

    allTasks.forEach((task) => {
      batch.set(db.doc(path + `/tasks/${task.id}`), task, { merge: true })
    })

    await batch.commit()
  } catch (e) {
    console.error('> Error in onStoreDocument:\n', e)
  }
}

const onDisconnect = async (data) => {
  console.log(data.socketId, ' is disconnected.')
}

const onDestroy = () => {
  console.log('> Server is destroyed.')
}

process.on('uncaughtException', function(err) {
	console.log('uncaughtException', err)
})

const server = new Hocuspocus({
  port: process.env.PORT || 3000,
  // timeout: 5000,
  extensions: [
    new Logger(),
    new Redis({
      host: "127.0.0.1",
      port: 6379,
    }),
  ],
  // onConnect,
  // onLoadDocument,
  // onStoreDocument,
  // onDisconnect,
  // onDestroy,
})



server.listen(() => console.log('> WebSocket server is running on port', process.env.PORT || 3000))