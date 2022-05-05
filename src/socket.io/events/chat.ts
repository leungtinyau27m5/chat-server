import chatService from 'src/db/controllers/chatService'
import wss from '..'
import { MySocket, SocketCodeMap } from 'src/socket.io/socket.proto'
import server from 'src/db/server'
import { getSimpleError } from 'src/helpers/common'
import { escape } from 'mysql2'
import Wss from '../classes/wss'
import User from 'src/db/models/user'
import Participant from 'src/db/models/participant'

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
        const participantsRes = await chatService.addParticipants(wssUser.data.id, result[0].insertId, members)
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
  socket.on('member:list', async (chatId, options) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('member:list', SocketCodeMap.undefinedUser)
        return
      }
      const { result, options: meta } = await chatService.listMember(wssUser.data.id, chatId, options)
      console.log(result)
      socket.emit('member:list', SocketCodeMap.success, {
        id: chatId,
        list: result[0],
        meta
      })
    } catch (error) {
      socket.emit('member:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('chat:create/private', async (data) => {
    try {
      const { hash } = data
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('chat:create/private', SocketCodeMap.undefinedUser, new Error('undefined user'))
        return
      }
      const result = await chatService.createChat(wssUser.data.id, {
        name: '',
        profile_pic: null,
        bio: null,
        type: 'private'
      })
      if (result[0].insertId !== -1) {
        const { result: data } = await chatService.listChat(wssUser.data.id, {
          limit: 1,
          wheres: [`c.id = ${escape(result[0].insertId)}`]
        })

        socket.emit('chat:create/private', SocketCodeMap.success, data[0])
        const participants = await chatService.addParticipants(wssUser.data.id, result[0].insertId, [
          {
            hash: hash,
            role: 'owner'
          },
          {
            hash: wssUser.data.hash,
            role: 'owner'
          }
        ])
        console.log('participants: ', participants)
        const ids = participants.map((ele) => ele.user_id)
        Object.entries(Wss.mappedId).forEach(([key, value]) => {
          if (ids.includes(Number(key))) {
            const user = wss.get(value)
            user?.socket.join(result[0].insertId.toString())
            user?.socket.emit('chat:invite', result[0].insertId)
          }
        })
      } else {
        socket.emit('chat:create/private', SocketCodeMap.unknown, new Error('create error'))
      }
    } catch (error) {
      console.log(error)
      socket.emit('chat:create/private', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('chat:get/private', async (userHash) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        return
      }
      const users = await User.list([{ hash: userHash }])
      if (users[0]) {
        const { id, hash } = users[0][0]
        const result1 = await Participant.matchUp(id)
        const result2 = await Participant.matchUp(wssUser.data.id)
        if (result1[0] && result2[0]) {
          const hashs = result1[0].map((ele) => ele.hash)
          const item = result2[0].find((ele) => hashs.includes(ele.hash))
          if (item) {
            socket.emit('chat:get/private', SocketCodeMap.success, {
              userHash: hash,
              chatHash: item.hash
            })
            return
          }
        }
        socket.emit('chat:get/private', SocketCodeMap.fail, {
          userHash: hash,
          chatHash: null
        })
      }
    } catch (error) {
      socket.emit('chat:get/private', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
}
