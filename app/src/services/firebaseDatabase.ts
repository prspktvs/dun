import app from '../config/firebase'
import { getFirestore, collection, doc, addDoc, setDoc, getDoc } from 'firebase/firestore'

export const db = getFirestore(app)
