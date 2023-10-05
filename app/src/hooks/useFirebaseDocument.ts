import { useState, useEffect } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore'
import { db } from '../services/firebaseDatabase'
import { doc } from 'firebase/firestore'

function splitPathToCollectionAndDocument(path: string) {
  const splited = path.split('/')
  const name = splited.pop()
  return {
    collection: splited,
    document: name,
  }
}

export function useFirebaseDocument(path: string) {
  const [data, setData] = useState([])

  const [value, loading, error] = useDocument(doc(db, path), {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && !error) {
      const newData = value.data()

      setData(newData)
    }
  }, [value, loading, error])

  return { data, loading, error }
}
