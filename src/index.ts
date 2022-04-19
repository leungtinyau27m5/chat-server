import 'src/utils/logger'
import server from 'src/db/server'
import { initSocket } from './socket.io'
import initExpress from './express'
import fs from 'fs'

fs.access('./uploads', (error) => {
  if (error) {
    fs.mkdirSync('./uploads')
  }
})

initSocket(server.socketIo)
initExpress(server.expressApp)

server.httpServer.listen(process.env.SERVER_PORT || 8000)
