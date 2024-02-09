import { useState, useEffect } from 'react'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { ITask } from '../types/Task'

export function useFirebaseCollection(path: string) {
  const [data, setData] = useState([])

  const [value, loading, error] = useCollection(collection(db, path), {
    snapshotListenOptions: { includeMetadataChanges: true },
  })

  useEffect(() => {
    async function getData() {
      const newData = await Promise.all(
        value.docs.map(async (doc) => {
          const tasksRef = collection(doc.ref, 'tasks')
          const taskSnapshot = await getDocs(tasksRef)
          const tasks: unknown[] = []

          taskSnapshot.forEach((task) => {
            tasks.push({ id: task.id, ...task.data() })
          })
          console.log(doc.id, tasks)

          return {
            ...doc.data(),
            id: doc.id,
            tasks,
          }
        }),
      )

      setData(newData)
    }
    if (!loading && !error) getData()
  }, [value, loading, error])

  return { data, loading, error }
}
