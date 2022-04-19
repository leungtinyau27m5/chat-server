import { Router } from 'express'
import multer from 'multer'
import server from 'src/db/server'
import { filters, getMulterStorage, limits } from 'src/utils/multer'
import userController from '../controllers/user'
import { expressVerifyJwt } from '../middleWares/jwt'

const userRoutes = Router()

userRoutes.post('/login', userController.login)
userRoutes.post('/register', userController.register)
userRoutes.get('/', [expressVerifyJwt], userController.get)
userRoutes.post(
  '/test',
  [
    multer({
      storage: getMulterStorage(),
      limits: limits.icon,
      fileFilter: filters.icon
    }).single('image')
  ],
  userController.testFileUpload
)

export default userRoutes
