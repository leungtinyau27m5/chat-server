import { ResultSetHeader } from 'mysql2'
import server from 'src/db/server'
import { logSql } from 'src/utils/logger'
import { DB } from '../db.proto'
import User from '../user'

class Message {
  user
  chatId
  constructor(user: User, chatId: number) {
    this.user = user
    this.chatId = chatId
  }
  create(data: Pick<DB.Schema.Message, 'message' | 'media' | 'meta'>) {
    const sql = `
      INSERT INTO ${Message.tableName}
        (sender_id, chat_id, message, media, meta, deleted)
      VALUES
        (?, ?, ?, ?, 0)
    `
    logSql(sql)
    return server.db
      .promise()
      .query<ResultSetHeader>(sql, [this.user.id, this.chatId, data.message, data.media, data.meta])
  }
  delete(id: number) {
    const sql = `
      DELETE FROM ${Message.tableName}
      WHERE id = ?
    `
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [id])
  }
  static tableName = 'messages'
}

export default Message
