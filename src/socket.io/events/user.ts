import { jwtVerify } from 'src/utils/jwt'
import { MySocket, SocketCodeMap } from 'src/socket.io/socket.proto'

export function user(socket: MySocket) {
  socket.on('user:login', async (token) => {
    try {
      const jwtRes = await jwtVerify(token)
      if (jwtRes.error) {
        socket.emit('user:login', SocketCodeMap.jwtInvalid, new Error(jwtRes.error.message))
        return
      }
      socket.emit('user:login', SocketCodeMap.jwtValid, jwtRes.data)
    } catch (error) {
      if (error instanceof Error) {
        socket.emit('user:login', SocketCodeMap.unknown, error)
      } else {
        socket.emit('user:login', SocketCodeMap.unknown, new Error('server internal error'))
      }
    }
  })
}
