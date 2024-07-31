import Typesense from 'typesense'

const client = new Typesense.Client({
  nodes: [{
    host: 'search.api.dun.wtf',
    port: 443,
    protocol: 'https'
  }],
  apiKey: process.env.TYPESENSE_KEY,
  connectionTimeoutSeconds: 2
})

const schema = {
  name: 'documents',
  default_sorting_field: 'created_at',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'author_id', type: 'string', facet: true },
    { name: 'author', type: 'string', facet: true },
    { name: 'project_id', type: 'string', facet: true },
    { name: 'created_at', type: 'int32' },
    { name: 'updated_at', type: 'int32' },
    { name: 'public', type: 'bool', facet: true },
    { name: 'tags', type: 'string[]', facet: true, optional: true },
    { name: 'user_ids', type: 'string[]', facet: true },
  ],
}

function createCollection() {
  return client.collections().create(schema)
    .then(function (data) {
      console.log('search schema created', data)
    })
}

client.collections('documents').retrieve()
  .then(function (data) {
    console.log('Search schema exists:', !!data)
    if (!data) {
      if (process.env.RESET_SEARCH) {
        return client.collections('documents').delete()
          .then(() => createCollection())
      }
      createCollection()
    }
  })
  .catch(function (error) {
    console.log('search schema not found', error)
    return createCollection()
  })

export function addDocument(document) {
  console.log('addDocument', document)
  return client.collections('documents').documents().upsert(document, {
    "dirty_values": "coerce_or_drop"
  })
}

export function importDocuments(documents) {
  return client.collections('documents').documents().import(documents)
}

export function searchDocuments(query) {
  return client.collections('documents').documents().search(query)
}