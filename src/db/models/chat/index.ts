import { ResultSetHeader, RowDataPacket } from 'mysql2'
import server from 'src/db/server'
import { logSql } from 'src/utils/logger'
import Message from '../message'
import Participant from '../participant'
import { DB } from '../db.proto'
import User from '../user'
import { ChatCls } from './chat.proto'

class Chat {
  user
  constructor(user: User) {
    this.user = user
  }

  create(data: Pick<DB.Schema.Chat, 'name' | 'profile_pic' | 'type' | 'bio'>) {
    const sql = `
      INSERT INTO ${Chat.tableName}
        (name, type, bio, profile_pic)
      VALUES
        (?, ?, ?, ?)
    `
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [data.name, data.type, data.bio, data.profile_pic])
  }
  getTotal() {
    let sql = `
      SELECT COUNT(*) as total FROM ${Chat.tableName} c
      INNER JOIN ${Participant.tableName} p
      ON p.chat_id = c.id AND p.user_id = ?
    `
    logSql(sql)
    return server.db.promise().query<({ total: number } & RowDataPacket)[]>(sql, [this.user.id])
  }
  list(offset: number, limit: number, wheres?: string[]) {
    let sql = `
      SELECT 
        c.*, m.id as msg_id,
        u.username,
        u.email,
        u.id as user_id,
        m.message,
        m.media,
        m.meta,
        m.created as last_msg_time,
        p.last_seen,
        CASE c.profile_pic
        WHEN c.type = 'group'
          THEN c.profile_pic
        WHEN c.type = 'private'
          THEN (
            SELECT u.profile_pic FROM ${User.tableName} u
            WHERE u.id != ${server.db.escape(this.user.id)}
            LIMIT 1
          )
        END as 'profile_pic'
      FROM ${Chat.tableName} c
      LEFT JOIN (
        SELECT m.* 
        FROM ${Message.tableName} m
        WHERE m.deleted = 0
        ORDER BY m.created DESC
        LIMIT 1
      ) as m ON m.chat_id = c.id
      LEFT JOIN ${Participant.tableName} p
      ON p.chat_id = c.id AND p.user_id = ${server.db.escape(this.user.id)}
      LEFT JOIN (
        SELECT u.username, u.email, u.id FROM ${User.tableName} u
      ) as u ON u.id = m.sender_id
    `
    if (wheres) {
      sql += ' WHERE ' + wheres.map((str) => str).join(' AND ')
    }
    sql += ' ORDER BY last_msg_time DESC '
    sql += ' LIMIT ? '
    sql += ' OFFSET ? '
    logSql(sql)
    return server.db.promise().query<ChatCls.ListResult>(sql, [limit, offset])
  }

  static tableName = 'chats'
}

export default Chat
