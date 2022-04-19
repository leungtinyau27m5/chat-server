import { ResultSetHeader, RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module UserCls {
  type LoginResult = (DB.Schema.User & RowDataPacket)[]
  type ListResult = (Pick<DB.Schema.User, 'id' | 'email' | 'status'> & RowDataPacket)[]
}
