import { useState, useEffect } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useFirebaseCollection(path: string) {
  const [data, setData] = useState([])

  const [value, loading, error] = useCollection(collection(db, path), {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    if (!loading && !error) {
      const newData = value.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setData(newData)
    }
  }, [value, loading, error])

  return { data, loading, error }
}
