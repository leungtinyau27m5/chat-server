import express from 'express'
import { Server } from 'socket.io'
import type { ConnectionOptions } from 'mysql2'
import { createConnection } from 'mysql2'
import { createServer } from 'http'
import { SocketEvents } from 'src/socket.io/socket.proto'
import devCorsList from 'src/constants/dev/cors.json'

class MyServer {
  socketIo
  expressApp
  httpServer
  db
  constructor(config: ConnectionOptions) {
    this.expressApp = express()
    this.httpServer = createServer(this.expressApp)
    this.socketIo = new Server<SocketEvents.ListenEvents, SocketEvents.EmitEvents>(this.httpServer, {
      cors: {
        origin: devCorsList
      }
    })
    this.db = createConnection(config)
  }
}

const server = new MyServer({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
})

export default server
