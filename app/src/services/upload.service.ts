import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { storage } from '../config/firebase'

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const mimeType = file.type
    const type = mimeType.split('/')[0] 
    const dir = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'files'
    const timestamp = new Date().getTime()
    const fileExtension = mimeType.split('/')[1]
    const fileName = `${type}_${timestamp}.${fileExtension}`

    const snapshot = await uploadBytes(ref(storage, `${dir}/${fileName}`), file)
    const url = await getDownloadURL(snapshot.ref)

    return url
  } catch (e) {
    console.log(e)
  }
}

export const uploadImage = async (path: string, file: Blob | Uint8Array | ArrayBuffer) => {
  try {
    const snapshot = await uploadBytes(ref(storage, `images/${path}`), file)
    const url = await getDownloadURL(snapshot.ref)
    
    return url
  } catch (e) {
    console.log(e)
  }
}
