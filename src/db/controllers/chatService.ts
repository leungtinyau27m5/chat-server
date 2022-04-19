import Chat from '../models/chat'
import Message from '../models/message'
import Participant from '../models/participant'
import { DB } from '../models/db.proto'
import User from '../models/user'
import wss from 'src/socket.io'

const chatService = {
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
  createChat: async (userId: number, data: Pick<DB.Schema.Chat, 'name' | 'profile_pic' | 'bio' | 'type'>) => {
    const user = new User(userId)
    const chat = new Chat(user)
    const result = await chat.create(data)
    return result
  },
  addParticipants: async (
    userId: number,
    chatId: number,
    rows: { id?: number; email?: string; role: DB.Schema.ParticipantRole }[]
  ) => {
    const result = await User.list(rows)
    const data: { role: DB.Schema.ParticipantRole; user_id: number }[] = []
    result[0].forEach((ele) => {
      const row = rows.find((row) => row.id === ele.id || row.email === ele.email)
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
    return result
  }
}

export default chatService
