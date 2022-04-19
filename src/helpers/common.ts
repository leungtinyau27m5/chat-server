import { FileFilterCallback } from 'multer'

export const getSimpleError = (error: unknown): string => {
  if (error === null) return 'unknown error'
  if (typeof error === 'object') {
    if ('sql' in error) {
      return (error as any).message
    } else if (error instanceof Error) {
      return error.message
    }
  } else if (typeof error === 'string') return error
  return 'unknown error'
}

export const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return cb(new Error('only image files are allowed'))
  }
  cb(null, true)
}
