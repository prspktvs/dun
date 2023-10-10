import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import dotenv from 'dotenv'
dotenv.config()
// import serviceAccount from './configs/adminAccount.json' assert { type: 'json' }

const credential = process.env.ADMIN_ACCOUNT_CREDENTIAL || ''
const app = initializeApp({
  credential: cert(JSON.parse(credential)),
})

export const db = getFirestore(app)
