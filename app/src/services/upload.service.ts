import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { storage } from '../config/firebase'
import { logAnalytics } from '../utils/analytics'
import { ANALYTIC_EVENTS } from '../constants/analytics.constants'

// Allowed file types with their extensions
const ALLOWED_TYPES = {
  // Images
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  'image/ico': 'ico',
  // Videos
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/avi': 'avi',
  'video/x-msvideo': 'avi',
  'video/mkv': 'mkv',
  'video/x-matroska': 'mkv',
  // Documents
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'text/csv': 'csv',
  'application/rtf': 'rtf',
  // Archives
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-7z-compressed': '7z',
  'application/x-tar': 'tar',
  'application/gzip': 'gz',
  // Code files
  'text/javascript': 'js',
  'text/typescript': 'ts',
  'text/html': 'html',
  'text/css': 'css',
  'application/json': 'json',
  'text/xml': 'xml',
  'application/xml': 'xml',
  // Audio
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  // Other
  'application/octet-stream': 'bin'
}

const generateSecureId = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const uploadFile = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error('No file provided')
    }
    
    if (file.size === 0) {
      throw new Error('File is empty')
    }
    
    const maxSizeInBytes = 200 * 1024 * 1024 // 200MB
    if (file.size > maxSizeInBytes) {
      throw new Error('File size exceeds 200MB limit')
    }
    
    const mimeType = file.type
    
    if (!mimeType) {
      throw new Error('File type could not be determined')
    }
    
    if (!ALLOWED_TYPES[mimeType as keyof typeof ALLOWED_TYPES]) {
      throw new Error(`File type '${mimeType}' is not allowed. Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`)
    }
    
    const type = mimeType.split('/')[0]
    const dir = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'files'
    
    const secureId = generateSecureId()
    const timestamp = Date.now()
    const fileExtension = ALLOWED_TYPES[mimeType as keyof typeof ALLOWED_TYPES]
    
    const originalNameHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(file.name))
    const hashArray = Array.from(new Uint8Array(originalNameHash))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8)
    
    const fileName = `${secureId}_${timestamp}_${hashHex}.${fileExtension}`

    const snapshot = await uploadBytes(ref(storage, `${dir}/${fileName}`), file)
    const url = await getDownloadURL(snapshot.ref)

    if (!url || typeof url !== 'string') {
      throw new Error('Failed to get download URL after upload')
    }

  logAnalytics(ANALYTIC_EVENTS.FILE_UPLOADED, { size: file.size, type: mimeType })
  return url
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Upload failed: ${e.message}`)
    }
    throw new Error('Upload failed: Unknown error occurred')
  }
}

export const uploadImage = async (path: string, file: Blob | Uint8Array | ArrayBuffer): Promise<string> => {
  try {
    if (!path) {
      throw new Error('No path provided')
    }
    
    if (!file) {
      throw new Error('No file provided')
    }
    
    const maxSizeInBytes = 20 * 1024 * 1024 // 20MB
    let fileSize = 0
    
    if (file instanceof Blob) {
      fileSize = file.size
    } else if (file instanceof ArrayBuffer) {
      fileSize = file.byteLength
    } else if (file instanceof Uint8Array) {
      fileSize = file.length
    }
    
    if (fileSize > maxSizeInBytes) {
      throw new Error('File size exceeds 200MB limit')
    }
    
    if (fileSize === 0) {
      throw new Error('File is empty')
    }
    
    const snapshot = await uploadBytes(ref(storage, `images/${path}`), file)
    const url = await getDownloadURL(snapshot.ref)
    
    if (!url || typeof url !== 'string') {
      throw new Error('Failed to get download URL after upload')
    }
    
  logAnalytics(ANALYTIC_EVENTS.IMAGE_UPLOADED, { size: fileSize, path })
  return url
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Image upload failed: ${e.message}`)
    }
    throw new Error('Image upload failed: Unknown error occurred')
  }
}
