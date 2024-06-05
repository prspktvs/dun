import { storage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadImage = async (path: string, file: Blob | Uint8Array | ArrayBuffer) => {
  try {
    const snapshot = await uploadBytes(ref(storage, `images/${path}`), file)
    const url = await getDownloadURL(snapshot.ref)
    
    return url
  } catch (e) {
    console.log(e)
  }
}
