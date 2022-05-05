import Chat from '../models/chat'
import Message from '../models/message'
import Participant from '../models/participant'
import { DB } from '../models/db.proto'
import User from '../models/user'
import Friend from '../models/friend'

const chatService = {
  createChat: async (userId: number, data: Pick<DB.Schema.Chat, 'name' | 'profile_pic' | 'type' | 'bio'>) => {
    const user = new User(userId)
    const chat = new Chat(user)
    const result = await chat.create(data)
    return result
  },
  addParticipants: async (
    userId: number,
    chatId: number,
    rows: { userId?: number; email?: string; hash?: string; role: DB.Schema.ParticipantRole }[]
  ) => {
    const result = await User.list(rows)
    console.log('users: ', result)
    const data: { role: DB.Schema.ParticipantRole; user_id: number }[] = []
    result[0].forEach((ele) => {
      const row = rows.find((row) => row.userId === ele.id || row.email === ele.email || row.hash === ele.hash)
      if (row) {
        data.push({
          role: row.role,
          user_id: ele.id
        })
      }
    })
    const user = new User(userId)
    await Promise.all(
      data.map((row) => {
        const participant = new Participant(user, chatId)
        return participant.create(row)
      })
    )
    return data
  },
  listChat: async (
    userId: number,
    options: {
      offset?: number
      limit?: number
      wheres?: string[]
    }
  ) => {
    options.offset ??= 0
    options.limit ??= 20
    const user = new User(userId)
    const chat = new Chat(user)
    const result = await chat.list(options.offset, options.limit, options.wheres)
    const [arr1] = await chat.getTotal()
    return {
      result,
      options: {
        ...options,
        total: arr1[0].total
      }
    }
  },
  listMember: async (
    userId: number,
    chatId: number,
    options: {
      offset?: number
      limit?: number
    }
  ) => {
    options.offset ??= 0
    options.limit ??= 20
    const user = new User(userId)
    const chat = new Chat(user)
    const result = await chat.getMembers(chatId, options.offset, options.limit)
    const [arr0] = await chat.getTotalMember(chatId)
    return {
      result,
      options: {
        ...options,
        total: arr0[0].total
      }
    }
  },
  listFriend: async (userId: number, chatId: number) => {
    const user = new User(userId)
    const role = await Participant.getRole(chatId, user.id)
    if (role[0][0]) {
      const friend = new Friend(user)
      const result = await friend.listInChat(chatId)
      return result
    }
    return null
  }
}

export default chatService
