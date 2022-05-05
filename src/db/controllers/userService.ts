import { escape } from 'mysql2'
import wss from 'src/socket.io'
import Wss from 'src/socket.io/classes/wss'
import WssUser from 'src/socket.io/classes/wssUser'
import Brcypt from 'src/utils/brcypt'
import { DB } from '../models/db.proto'
import Friend from '../models/friend'
import User from '../models/user'

const userService = {
  login: async (email: string, password: string) => {
    const result = await User.login(email)
    console.log(result)
    if (result[0][0]) {
      const isValid = Brcypt.compare(password, result[0][0].password)
      if (isValid) {
        const { password, ...data } = result[0][0]
        return data
      }
    }
    return null
  },
  tokenLogin: async (email: string) => {
    const result = await User.login(email)
    if (result[0][0]) return result[0][0]
    return null
  },
  register: async (data: Pick<DB.Schema.User, 'username' | 'email' | 'password' | 'profile_pic' | 'bio'>) => {
    const result = await User.create(data)
    return result
  },
  getFriendList: async (id: number, offset = 0, limit = 20) => {
    const user = new User(id)
    const friend = new Friend(user)
    const result = await friend.list(offset, limit, [`f.owner_id = ${escape(id)}`])
    const [arr1] = await friend.total()
    return {
      list: result[0],
      options: {
        offset,
        limit,
        total: arr1[0].total
      }
    }
  },
  updateStatus: async (id: number, status: DB.Schema.User['status']) => {
    const user = new User(id)
    const result = await user.update({
      status
    })
    return result[0]
  },
  notifyFriend: async (userId: number, userData: Pick<DB.Schema.User, 'id' | 'hash' | 'status'>) => {
    console.log('notify friend run???')
    const user = new User(userId)
    const friend = new Friend(user)
    const list = await friend.list(undefined, undefined, [`f.user_id = ${escape(userData.id)}`])
    const ids = Object.keys(Wss.mappedId)
    list[0].forEach((ele) => {
      if (ids.includes(ele.user_id.toString())) {
        const socketId = Wss.mappedId[ele.owner_id]
        const wssUser = wss.get(socketId)
        wssUser?.socket.emit('friend:status', {
          userId: userData.id,
          userHash: userData.hash,
          status: userData.status
        })
      }
    })
  }
}

export default userService
