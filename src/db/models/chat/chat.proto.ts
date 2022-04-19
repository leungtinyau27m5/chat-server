import { RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module ChatCls {
  type ListResult = (DB.Schema.Chat & any & RowDataPacket)[]
}
