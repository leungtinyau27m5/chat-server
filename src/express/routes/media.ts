import { Router } from 'express'
import mediaController from '../controllers/media'
import { expressVerifyJwt } from '../middleWares/jwt'

const mediaRoutes = Router()

mediaRoutes.get('/user/:profilePic', [expressVerifyJwt], mediaController.profilePic)

export default mediaRoutes
