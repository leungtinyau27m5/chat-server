import { Router } from 'express'
import multer from 'multer'
import { filters, getMulterStorage, limits } from 'src/utils/multer'
import userController from '../controllers/user'
import { expressVerifyJwt } from '../middleWares/jwt'

const userRoutes = Router()

userRoutes.post('/login', userController.login)
userRoutes.post(
  '/register',
  [
    multer({
      storage: getMulterStorage(),
      limits: limits.icon,
      fileFilter: filters.icon
    }).single('profilePic')
  ],
  userController.register
)
userRoutes.get('/', [expressVerifyJwt], userController.get)

export default userRoutes
