import { jwtVerify } from 'src/utils/jwt'
import { MySocket, SocketCodeMap } from 'src/socket.io/socket.proto'
import chatService from 'src/db/controllers/chatService'
import logger from 'src/utils/logger'
import { getSimpleError } from 'src/helpers/common'
import wss from '..'
import WssUser from '../classes/wssUser'
import server from 'src/db/server'
import userService from 'src/db/controllers/userService'

export function user(socket: MySocket) {
  socket.on('user:login', async (token) => {
    try {
      const jwtRes = await jwtVerify(token)
      if (jwtRes.error) {
        socket.emit('user:login', SocketCodeMap.jwtInvalid, new Error(jwtRes.error.message))
        return
      }
      const { id, email } = jwtRes.data
      const data = await userService.tokenLogin(email)
      if (!data) return
      const { password, ...userData } = data
      const wssUser = new WssUser(socket)
      wssUser.login(id, email)
      wss.set(socket.id, wssUser)
      socket.emit('user:login', SocketCodeMap.jwtValid, userData)
      try {
        const {
          result: list,
          options: { wheres, ...meta }
        } = await chatService.listChat(id, {
          wheres: [`p.user_id = ${server.db.escape(id)}`]
        })
        socket.join(list[0].map((ele) => ele.id.toString()))
        socket.emit('chat:list', SocketCodeMap.success, { list: list[0], meta: meta })
      } catch (error) {
        socket.emit('chat:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
        console.log(error)
      }
    } catch (error) {
      socket.emit('user:login', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
  socket.on('user:status', async (status) => {
    try {
      const wssUser = wss.get(socket.id)
      if (!wssUser?.data) {
        socket.emit('user:status', SocketCodeMap.unauthorizedUser, new Error('user undeinfed'))
        return
      }
      const result = await userService.updateStatus(wssUser.data.id, status)
      if (result.affectedRows) {
        socket.emit('user:status', SocketCodeMap.success, status)
        return
      }
      socket.emit('user:status', SocketCodeMap.unknown)
    } catch (error) {
      socket.emit('user:status', SocketCodeMap.unknown, new Error(getSimpleError(error)))
    }
  })
}
