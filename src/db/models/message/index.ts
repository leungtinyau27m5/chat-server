import { escape, ResultSetHeader, RowDataPacket } from 'mysql2'
import server from 'src/db/server'
import { logSql } from 'src/utils/logger'
import { DB } from '../db.proto'
import User from '../user'
import { MessageCls } from './message.proto'

class Message {
  user
  chatId
  constructor(user: User, chatId: number) {
    this.user = user
    this.chatId = chatId
  }
  create(data: Pick<DB.Schema.Message, 'message' | 'media' | 'meta'>) {
    const { message = null, media = null, meta = {} } = data
    const sql = `
      INSERT INTO ${Message.tableName}
        (sender_id, chat_id, message, media, meta, deleted)
      VALUES
        (?, ?, ?, ?, ?, 0)
    `
    logSql(sql)
    return server.db
      .promise()
      .query<ResultSetHeader>(sql, [this.user.id, this.chatId, message, media, JSON.stringify(media)])
  }
  list(offset: number, limit: number, wheres?: string[]) {
    let sql = `
      SELECT 
        m.*, u.id as user_id, u.email, 
        u.hash, u.username, u.profile_pic, m.created,
        CASE u.status
        WHEN u.status = 'hide'
          THEN 'offline'
        ELSE
          u.status
      END as 'status'
      FROM ${Message.tableName} m
      INNER JOIN ${User.tableName} u
      ON u.id = m.sender_id
      WHERE m.chat_id = ?
      AND deleted = 0
    `
    if (wheres) {
      sql += ' AND ' + wheres.map((str) => str).join(' AND ')
    }
    sql += ' ORDER BY m.created desc '
    sql += ' LIMIT ? '
    sql += ' OFFSET ? '
    console.log(this.chatId)
    logSql(sql)
    return server.db.promise().query<MessageCls.ListResult>(sql, [this.chatId, limit, offset])
  }
  getTotal() {
    const sql = `
      SELECT COUNT(*) as total FROM ${Message.tableName} m
      WHERE m.chat_id = ?
      AND m.deleted = 0
    `
    logSql(sql)
    return server.db.promise().query<({ total: number } & RowDataPacket)[]>(sql, [this.chatId])
  }
  delete(id: number) {
    const sql = `
      UPDATE ${Message.tableName}
      SET deleted = 1
      WHERE id = ?
      AND sender_id = ?
    `
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [id, this.user.id])
  }
  edit(id: number, data: Partial<Pick<DB.Schema.Message, 'message'>>) {
    let sql = `
      UPDATE ${Message.tableName}
      SET 
    `
    sql += Object.entries(data)
      .map(([key, value]) => `${key} = ${escape(value)}`)
      .join(', ')
    sql += ` WHERE id = ? AND sender_id = ?`
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [id, this.user.id])
  }
  static tableName = 'messages'
}

export default Message
