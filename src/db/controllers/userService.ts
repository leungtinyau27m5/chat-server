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
  getFriendList: async (id: number) => {
    const user = new User(id)
    const friend = new Friend(user)
    const result = await friend.list()
    return result[0]
  },
  updateStatus: async (id: number, status: DB.Schema.User['status']) => {
    const user = new User(id)
    const result = await user.update({
      status
    })
    return result[0]
  }
}

export default userService
