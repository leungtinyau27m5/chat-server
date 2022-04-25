import { Socket } from 'socket.io'
import { ChatCls } from 'src/db/models/chat/chat.proto'
import { DB } from 'src/db/models/db.proto'
import { MessageCls } from 'src/db/models/message/message.proto'

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
    'message:send': (chatId: number, data: Pick<DB.Schema.Message, 'message' | 'media' | 'meta'>) => void
    'message:list': (
      chatId: number,
      options: {
        offset?: number
        limit?: number
      }
    ) => void
  }
  interface EmitEvents {
    'user:login': (code: SocketCodeMap, res: Error | Omit<DB.Schema.User, 'password'>) => void
    'chat:list': (
      code: SocketCodeMap,
      res?:
        | {
            list: ChatCls.ListResult
            meta: {
              offset?: number
              limit?: number
              total: number
            }
          }
        | Error
    ) => void
    'chat:craete': (code: SocketCodeMap, res: Error | ChatCls.ListResult) => void
    'chat:invite': (chatId: number) => void
    'chat:get': (code: SocketCodeMap, res: ChatCls.ListResult | Error) => void
    'message:send': (code: SocketCodeMap, res?: Error) => void
    'message:update': (data: { chatId: number; list: MessageCls.ListResult }) => void
    'message:list': (
      code: SocketCodeMap,
      res?:
        | {
            chatId: number
            list: MessageCls.ListResult
            meta: {
              offset?: number
              limit?: number
              total: number
            }
          }
        | Error
    ) => void
  }
}

export enum SocketCodeMap {
  success,
  jwtValid,
  jwtInvalid,
  undefinedUser,
  undefinedGroup,
  unauthorizedUser,
  unauthorizedRole,
  insertFail,
  unknown
}

export type MySocket = Socket<SocketEvents.ListenEvents, SocketEvents.EmitEvents>
