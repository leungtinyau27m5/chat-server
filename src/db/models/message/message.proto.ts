import { RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module MessageCls {
  type ListResult = (DB.Schema.Message &
    Pick<DB.Schema.User, 'email' | 'username' | 'profile_pic' | 'status'> & {
      user_id: number
    } & RowDataPacket)[]
}
