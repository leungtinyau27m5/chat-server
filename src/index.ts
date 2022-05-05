import 'src/utils/logger'
import server from 'src/db/server'
import { initSocket } from './socket.io'
import initExpress from './express'
import fs from 'fs'

fs.access('./uploads/users', (error) => {
  if (error) {
    fs.mkdirSync('./uploads/users/')
  }
})
fs.access('./uploads/chats', (error) => {
  if (error) {
    fs.mkdirSync('./uploads/chats/')
  }
})
fs.access('./uploads/images', (error) => {
  if (error) {
    fs.mkdirSync('./uploads/images/')
  }
})

initSocket(server.socketIo)
initExpress(server.expressApp)

server.httpServer.listen(process.env.SERVER_PORT || 8000)
