import { RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module ChatCls {
  type ListResult = (DB.Schema.Chat & {
    msg_id: null | number
    username: null | string
    email: null | string
    user_id: null | number
    message: null | string
    media: null | string
    meta: null | any
    last_msg_time: null | string
    last_seen: null | string
  } & RowDataPacket)[]
}
