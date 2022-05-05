import chatService from 'src/db/controllers/chatService'
import wss from '..'
import { MySocket, SocketCodeMap } from 'src/socket.io/socket.proto'
import server from 'src/db/server'
import { getSimpleError } from 'src/helpers/common'

export function chat(socket: MySocket) {
  socket.on('chat:list', async (offset, limit) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('chat:list', SocketCodeMap.undefinedUser)
        return
      }
      const {
        result,
        options: { wheres, ...meta }
      } = await chatService.listChat(wssUser.data.id, {
        offset,
        limit,
        wheres: [`p.user_id = ${server.db.escape(wssUser.data.id)}`]
      })
      socket.emit('chat:list', SocketCodeMap.success, { list: result[0], meta })
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('chat:list', SocketCodeMap.unknown, error)
      } else {
        socket.emit('chat:list', SocketCodeMap.unknown, new Error('internal server error'))
      }
    }
  })
  socket.on('chat:create', async (data, members) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('chat:list', SocketCodeMap.undefinedUser)
        return
      }
      const result = await chatService.createChat(wssUser.data.id, data)
      if (result[0].insertId) {
        const { result: data } = await chatService.listChat(wssUser.data.id, {
          limit: 1,
          wheres: [`c.id = ${server.db.escape(result[0].insertId)}`]
        })
        socket.emit('chat:create', SocketCodeMap.success, data[0])
        members.push({
          userId: wssUser.data.id,
          role: 'owner'
        })
        console.log(members)
        const participantsRes = await chatService.addParticipants(wssUser.data.id, result[0].insertId, members)
        console.log(participantsRes)
        const ids = participantsRes.map((ele) => ele.user_id)
        Object.keys(wss.wssUsers).forEach((key) => {
          const user = wss.wssUsers[key]
          if (user?.data) {
            if (ids.includes(user.data.id)) {
              user.socket.join(result[0].insertId.toString())
              user.socket.emit('chat:invite', result[0].insertId)
            }
          }
        })
      } else {
        socket.emit('chat:create', SocketCodeMap.unknown, new Error('create error'))
      }
    } catch (error) {
      console.log(error)
      socket.emit('chat:create', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('chat:get', async (chatId) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('chat:list', SocketCodeMap.undefinedUser)
        return
      }
      const { result } = await chatService.listChat(wssUser.data.id, {
        wheres: [`c.id = ${server.db.escape(chatId)}`]
      })
      socket.emit('chat:get', SocketCodeMap.success, result[0])
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('chat:create', SocketCodeMap.unknown, error)
      } else {
        socket.emit('chat:list', SocketCodeMap.unknown, new Error('internal server error'))
      }
    }
  })
  socket.on('member:list', async (chatId) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('member:list', SocketCodeMap.undefinedUser)
        return
      }
      const { result, options } = await chatService.listMember(wssUser.data.id, chatId, {})
      console.log(result)
      socket.emit('member:list', SocketCodeMap.success, {
        id: chatId,
        list: result[0],
        meta: {
          ...options
        }
      })
    } catch (error) {
      socket.emit('member:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
}
