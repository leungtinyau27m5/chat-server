import { jwtVerify } from 'src/utils/jwt'
import { MySocket, SocketCodeMap } from 'src/socket.io/socket.proto'
import chatService from 'src/db/controllers/chatService'
import logger from 'src/utils/logger'
import { getSimpleError } from 'src/helpers/common'
import wss from '..'
import WssUser from '../classes/wssUser'
import server from 'src/db/server'

export function user(socket: MySocket) {
  socket.on('user:login', async (token) => {
    try {
      const jwtRes = await jwtVerify(token)
      if (jwtRes.error) {
        socket.emit('user:login', SocketCodeMap.jwtInvalid, new Error(jwtRes.error.message))
        return
      }
      const { exp, iat, iss, sub, ...data } = jwtRes.data
      const wssUser = new WssUser(socket)
      wssUser.login(data.id, data.email)
      wss.set(socket.id, wssUser)
      socket.emit('user:login', SocketCodeMap.jwtValid, data)
      if (!wssUser.data) return
      try {
        const {
          result: list,
          options: { wheres, ...meta }
        } = await chatService.listChat(data.id, {
          wheres: [`p.user_id = ${server.db.escape(wssUser.data.id)}`]
        })
        console.log(meta)
        socket.join(list[0].map((ele) => ele.id.toString()))
        socket.emit('chat:list', SocketCodeMap.success, { list: list[0], meta: meta })
      } catch (error) {
        socket.emit('chat:list', SocketCodeMap.unknown, new Error(getSimpleError(error)))
        console.log(error)
      }
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('user:login', SocketCodeMap.unknown, error)
      } else {
        socket.emit('user:login', SocketCodeMap.unknown, new Error('server internal error'))
      }
    }
  })
}
