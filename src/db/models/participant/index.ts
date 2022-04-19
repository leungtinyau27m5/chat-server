import { ResultSetHeader } from 'mysql2'
import server from 'src/db/server'
import { logSql } from 'src/utils/logger'
import { DB } from '../db.proto'
import User from '../user'
import { ParticipantCls } from './participant.proto'

class Participant {
  chatId
  user
  constructor(user: User, chatId: number) {
    this.user = user
    this.chatId = chatId
  }

  create(data: Pick<DB.Schema.Participant, 'role' | 'user_id'>) {
    const sql = `
      INSERT INTO ${Participant.tableName} p
        (chat_id, user_id, role)
      VALUES (?, ?, ?)
    `
    return server.db.promise().query<ResultSetHeader>(sql, [this.chatId, data.user_id, data.role])
  }
  remove() {}
  changeRole() {}

  static tableName = 'participants'

  static isMemberUp(role: DB.Schema.ParticipantRole) {
    return ['member', 'admin', 'owner'].includes(role)
  }

  static isAdminUp(role: DB.Schema.ParticipantRole) {
    return ['admin', 'owner'].includes(role)
  }

  static getRole(chatId: number, userId: number) {
    const sql = `
      SELECT p.role FROM ${Participant.tableName} p
      WHERE chat_id = ?
      AND user_id = ?
      LIMIT 1
    `
    logSql(sql)
    return server.db.promise().query<ParticipantCls.GetRoleResult>(sql, [chatId, userId])
  }
}

export default Participant
