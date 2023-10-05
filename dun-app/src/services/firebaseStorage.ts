import app from '../config/firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage(app)

export const uploadImage = async (path: string, file: Blob | Uint8Array | ArrayBuffer) => {
  try {
    const snapshot = await uploadBytes(ref(storage, `images/${path}`), file)
    const url = await getDownloadURL(snapshot.ref)
    return url
  } catch (e) {
    console.log(e)
  }
}
