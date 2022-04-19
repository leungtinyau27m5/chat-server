import { RowDataPacket } from 'mysql2'
import { DB } from '../db.proto'

export declare module ParticipantCls {
  type GetRoleResult = ({ role: DB.Schema.ParticipantRole } & RowDataPacket)[]
}
