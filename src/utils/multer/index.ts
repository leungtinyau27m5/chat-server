import multer, { Options } from 'multer'
import path from 'path'

export const uploadPath = './uploads'

export const getMulterStorage = (isDisk?: boolean) => {
  const targetPath = path.resolve(uploadPath)
  const storage = isDisk
    ? multer.diskStorage({
        destination: targetPath
      })
    : multer.memoryStorage()
  return storage
}

export const limits: { [key: string]: Options['limits'] } = {
  icon: {
    fileSize: 1024 * 1024 * 5
  }
}

export const filters: { [key: string]: Options['fileFilter'] } = {
  icon: (req, file, callback) => {
    const ext = path.extname(file.originalname)
    if (!['.png', '.gif', '.jpg', 'jpeg', '.webp'].includes(ext)) {
      return callback(new Error('only images are allowed'))
    }
    return callback(null, true)
  }
}
