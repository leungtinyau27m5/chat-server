import { Server } from 'socket.io'
import Wss from './classes/wss'
import { chat } from './events/chat'
import { user } from './events/user'
import { MySocket } from './socket.proto'

const wss = new Wss()

export function initSocket(io: Server<MySocket>) {
  io.on('connection', (socket) => {
    wss.addVisitor(socket)
    user(socket)
    chat(socket)
  })
}

export default wss
