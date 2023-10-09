import { Hocuspocus } from '@hocuspocus/server'
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
    console.log(e)
  }
}

// calls after onChange with debounce https://tiptap.dev/hocuspocus/server/hooks#on-store-document
const onStoreDocument = async (data) => {
  try {
    const json = TiptapTransformer.fromYdoc(data.document, 'document-store')
    const path = `projects/${data.documentName}`
    // console.log(JSON.stringify(json, null, 2))
    const { allTasks, allFiles, description } = parser(json)

    const batch = db.batch()
    batch.update(db.doc(path), {
      document: json,
      files: allFiles,
      description,
    }) // save Y.Doc

    allTasks.forEach((task) => {
      batch.set(db.doc(path + `/tasks/${task.id}`), task, { merge: true })
    })

    await batch.commit()
  } catch (e) {
    console.error(e)
  }
}

const onDisconnect = async (data) => {
  // console.log(data.socketId, ' is disconnected.')
}

const server = new Hocuspocus({
  onConnect,
  onLoadDocument,
  onStoreDocument,
  onDisconnect,
})

server.listen()
