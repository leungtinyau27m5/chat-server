import express from 'express'
import { Server } from 'socket.io'
import type { ConnectionOptions } from 'mysql2'
import { createConnection } from 'mysql2'
import { createServer } from 'http'
import { SocketEvents } from 'src/socket.io/socket.proto'

class MyServer {
  socketIo
  expressApp
  httpServer
  db
  constructor(config: ConnectionOptions) {
    this.expressApp = express()
    this.httpServer = createServer(this.expressApp)
    this.socketIo = new Server<SocketEvents.ListenEvents, SocketEvents.EmitEvents>(this.httpServer)
    this.db = createConnection(config)
    // this.upload = multer({
    //   storage,
    //   limits: {
    //     fileSize: 8 * 1024 * 10 // bytes
    //   }
    // })
    // this.storage = multer.diskStorage({
    //   destination: (req, file, callback) => {
    //     callback(null, './uploads')
    //   },
    //   filename: (req, file, callback) => {
    //     callback(null, file.originalname)
    //   }
    // })
  }
}

const server = new MyServer({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
})

export default server
