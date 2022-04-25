import { DB } from '../models/db.proto'
import Message from '../models/message'
import Participant from '../models/participant'
import User from '../models/user'

const messageService = {
  createMessage: async (
    userId: number,
    chatId: number,
    data: Pick<DB.Schema.Message, 'message' | 'media' | 'meta'>
  ) => {
    const rows = await Participant.getRole(chatId, userId)
    if (rows[0].length) {
      const userRole = rows[0][0].role
      if (Participant.isMemberUp(userRole)) {
        const user = new User(userId)
        const message = new Message(user, chatId)
        const result = await message.create({
          ...data
        })
        return result
      }
    }
    return null
  },
  listMessage: async (
    userId: number,
    chatId: number,
    options: {
      offset?: number
      limit?: number
      wheres?: string[]
    }
  ) => {
    options.offset ??= 0
    options.limit ??= 20
    const user = new User(userId)
    const message = new Message(user, chatId)
    const result = await message.list(options.offset, options.limit, options.wheres)
    const [arr1] = await message.getTotal()
    console.log('message list:')
    console.log(arr1)
    return {
      result,
      options: {
        ...options,
        total: arr1[0].total
      }
    }
  }
}

export default messageService
