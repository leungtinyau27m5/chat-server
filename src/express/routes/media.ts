import { Router } from 'express'
import multer from 'multer'
import { filters, getMulterStorage, limits } from 'src/utils/multer'
import mediaController from '../controllers/media'
import { expressVerifyJwt } from '../middleWares/jwt'

const mediaRoutes = Router()

mediaRoutes.get('/user/:profilePic', [expressVerifyJwt], mediaController.profilePic)
mediaRoutes.get('/chat/:profilePic', [expressVerifyJwt], mediaController.chatProfilePic)
mediaRoutes.post(
  '/chat/profilePic',
  [
    expressVerifyJwt,
    multer({
      storage: getMulterStorage(),
      limits: limits.icon,
      fileFilter: filters.icon
    }).single('profilePic')
  ],
  mediaController.postProfilePic
)

export default mediaRoutes
