import userService from 'src/db/controllers/userService'
import { DB } from 'src/db/models/db.proto'
import User from 'src/db/models/user'
import { MySocket } from '../socket.proto'
import Wss from './wss'

class WssUser {
  socket
  data: {
    id: number
    email: string
    status: DB.Schema.UserStatus
    hash: string
  } | null
  constructor(socket: MySocket) {
    this.socket = socket
    this.data = null
  }
  async login(id: number, email: string, hash: string) {
    this.data = {
      id,
      email,
      hash,
      status: 'available'
    }
    Wss.mappedId[id] = this.socket.id
    await userService.updateStatus(id, 'available')
  }
}

export default WssUser
