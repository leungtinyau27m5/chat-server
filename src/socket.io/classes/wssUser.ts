import { DB } from 'src/db/models/db.proto'
import { MySocket } from '../socket.proto'

class WssUser {
  socket
  data: {
    id: number
    email: string
    status: DB.Schema.UserStatus
  } | null
  constructor(socket: MySocket) {
    this.socket = socket
    this.data = null
  }
  login(id: number, email: string) {
    this.data = {
      id,
      email,
      status: 'available'
    }
  }
}

export default WssUser
