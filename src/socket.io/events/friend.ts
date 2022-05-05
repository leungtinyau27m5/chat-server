import chatService from 'src/db/controllers/chatService'
import userService from 'src/db/controllers/userService'
import { getSimpleError } from 'src/helpers/common'
import wss from '..'
import { MySocket, SocketCodeMap } from '../socket.proto'

export default function friend(socket: MySocket) {
  socket.on('friend:list', async (offset, limit) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('friend:list', SocketCodeMap.undefinedUser, new Error('undefined user'))
        return
      }
      const { list, options } = await userService.getFriendList(wssUser.data.id, offset, limit)
      console.log(list)
      if (list) {
        socket.emit('friend:list', SocketCodeMap.success, {
          list,
          meta: options
        })
        return
      }
      socket.emit('friend:list', SocketCodeMap.unknown, new Error('not found'))
    } catch (error) {
      socket.emit('friend:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('friend:listInChat', async (chatId) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        return
      }
      const result = await chatService.listFriend(wssUser.data.id, chatId)
      if (result === null) {
        socket.emit('friend:listInChat', SocketCodeMap.unauthorizedRole, new Error('unauthorized action'))
        return
      }
      socket.emit('friend:listInChat', SocketCodeMap.success, result[0])
    } catch (error) {
      socket.emit('friend:listInChat', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
}
