import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'


const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  databaseURL: process.env.VITE_DATABASE_URL,
  appId: process.env.VITE_APP_ID,
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

const storage = getStorage(app)

const realtimeDb = getDatabase(app)

const analytics = getAnalytics(app)

export { app, auth, db, storage, realtimeDb, analytics }