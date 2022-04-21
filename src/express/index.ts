import type { Express } from 'express'
import { json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user'
import devCorsList from 'src/constants/dev/cors.json'
import mediaRoutes from './routes/media'

export default function initExpress(app: Express) {
  app.use(json())
  app.use(urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(
    cors({
      origin: devCorsList,
      credentials: true
    })
  )
  app.use('/user', userRoutes)
  app.use('/media', mediaRoutes)
}
