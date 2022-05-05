import { RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module FriendCls {
  type ListResult = (DB.Schema.Friend &
    Pick<DB.Schema.User, 'username' | 'status' | 'profile_pic' | 'bio'> &
    RowDataPacket)[]
}
