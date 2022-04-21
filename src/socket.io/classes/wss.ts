import { MySocket } from '../socket.proto'
import WssUser from './wssUser'

class Wss {
  wssUsers: { [key: string]: WssUser | null }
  constructor() {
    this.wssUsers = {}
  }
  get(id: string) {
    return this.wssUsers[id]
  }
  set(id: string, user: WssUser) {
    this.wssUsers[id] = user
  }
  addVisitor(socket: MySocket) {
    this.wssUsers[socket.id] = new WssUser(socket)
  }
  delete(id: string) {
    delete this.wssUsers[id]
  }
}

export default Wss
