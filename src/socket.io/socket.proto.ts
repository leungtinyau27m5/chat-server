import { Socket } from 'socket.io'
import { ChatCls } from 'src/db/models/chat/chat.proto'
import { DB } from 'src/db/models/db.proto'
import { JwtResponse } from 'src/utils/jwt'

export declare module SocketEvents {
  interface ListenEvents {
    'user:login': (token: string) => void
    'friend:list': (offset?: number, limit?: number) => void
    'friend:add': (data: { email: string; markedName: string }[]) => void
    'friend:remove': (ids: number[]) => void
    'chat:list': (offset?: number, limit?: number) => void
    'chat:create': (
      data: Pick<DB.Schema.Chat, 'name' | 'profile_pic' | 'type' | 'bio'>,
      members: {
        email?: string
        userId?: number
        role: DB.Schema.ParticipantRole
      }[]
    ) => void
    'chat:get': (chatId: number) => void
  }
  interface EmitEvents {
    'user:login': (code: SocketCodeMap, res: Error | JwtResponse) => void
    'chat:list': (code: SocketCodeMap, res?: ChatCls.ListResult | Error) => void
    'chat:craete': (code: SocketCodeMap, res: Error | ChatCls.ListResult) => void
    'chat:invite': (chatId: number) => void
    'chat:get': (code: SocketCodeMap, res: ChatCls.ListResult | Error) => void
  }
}

export enum SocketCodeMap {
  jwtValid,
  jwtInvalid,
  undefinedUser,
  undefinedGroup,
  unauthorizedUser,
  unauthorizedRole,
  unknown,
  success
}

export type MySocket = Socket<SocketEvents.ListenEvents, SocketEvents.EmitEvents>
