import messageService from 'src/db/controllers/messageService'
import server from 'src/db/server'
import { getSimpleError } from 'src/helpers/common'
import wss from '..'
import { MySocket, SocketCodeMap } from '../socket.proto'

export function message(socket: MySocket) {
  socket.on('message:send', async (chatId, data) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('message:send', SocketCodeMap.undefinedUser)
        return
      }
      const result = await messageService.createMessage(wssUser.data.id, chatId, data)
      if (!result) {
        socket.emit('message:send', SocketCodeMap.insertFail, new Error(getSimpleError('insert fail')))
        return
      }
      const id = result[0].insertId
      const {
        result: list,
        options: { wheres, ...meta }
      } = await messageService.listMessage(wssUser.data.id, chatId, {
        offset: 0,
        limit: 1,
        wheres: [`m.id = ${id}`]
      })
      server.socketIo.in(chatId.toString()).emit('message:update', {
        chatId,
        list: list[0]
      })
    } catch (error) {
      console.log(error)
      socket.emit('message:send', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('message:list', async (chatId, options) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('message:list', SocketCodeMap.undefinedUser)
        return
      }
      const { result, options: meta } = await messageService.listMessage(wssUser.data.id, chatId, options)
      socket.emit('message:list', SocketCodeMap.success, {
        chatId,
        list: result[0].reverse(),
        meta
      })
    } catch (error) {
      socket.emit('message:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('message:edit', async (chatId, msgId, message) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('message:edit', SocketCodeMap.undefinedUser)
        return
      }
      const result = await messageService.editMessage(wssUser.data.id, chatId, msgId, message)
      if (result[0].affectedRows) {
        socket.emit('message:edit', SocketCodeMap.success)
        server.socketIo.in(chatId.toString()).emit('message:modified', chatId, [
          {
            actions: 'edit',
            id: msgId,
            message: message
          }
        ])
        return
      }
      socket.emit('message:edit', SocketCodeMap.updateFail)
    } catch (error) {
      socket.emit('message:edit', SocketCodeMap.updateFail, new Error(getSimpleError(error)))
    }
  })
  socket.on('message:delete', async (chatId, msgId) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('message:delete', SocketCodeMap.undefinedUser, new Error('undefined user'))
        return
      }
      const results = await messageService.deleteMessage(wssUser.data.id, chatId, msgId)
      const idsx: number[] = []
      results.map((ele, idx) => {
        if (ele[0].affectedRows) idsx.push(msgId[idx])
      })
      socket.emit('message:delete', SocketCodeMap.success, idsx)
      server.socketIo.in(chatId.toString()).emit(
        'message:modified',
        chatId,
        idsx.map((id) => ({
          actions: 'delete' as any,
          id
        }))
      )
      // server.socketIo.in(chatId.toString()).emit(
      //   'message:modified',
      //   chatId,
      //   idsx.map((id) => ({
      //     actions: 'delete',
      //     id
      //   }))
      // )
    } catch (error) {
      socket.emit('message:delete', SocketCodeMap.updateFail, new Error(getSimpleError(error)))
    }
  })
}
