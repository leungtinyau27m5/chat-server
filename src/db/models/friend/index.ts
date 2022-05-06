import { escape, ResultSetHeader, RowDataPacket } from 'mysql2'
import server from 'src/db/server'
import { logSql } from 'src/utils/logger'
import { DB } from '../db.proto'
import Participant from '../participant'
import User from '../user'
import { FriendCls } from './friend.proto'

class Friend {
  user
  constructor(user: User) {
    this.user = user
  }

  create(data: Pick<DB.Schema.Friend, 'marked_name' | 'user_id'>) {
    const sql = `
      INSERT INTO ${Friend.tableName}
        (owner_id, user_id, marked_name)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE ${Friend.tableName} SET marked_name = ${server.db.escape(
      data.marked_name
    )} WHERE user_id = ${server.db.escape(data.user_id)}
    AND owner_id = ${server.db.escape(this.user.id)}
    `
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [this.user.id, data.user_id, data.marked_name])
  }
  update(data: Pick<DB.Schema.Friend, 'marked_name' | 'user_id'>) {
    const sql = `
      UPDATE ${Friend.tableName}
      SET marked_name = ?
      WHERE user_id = ?
      AND OWNER_id = ?
    `
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [data.marked_name, data.user_id, this.user.id])
  }
  remove(data: { user_id: string }[]) {
    let sql = `
      DELETE FROM ${Friend.tableName}
      WHERE owner_id = ?
      AND user_id IN 
    `
    sql += `(${data.map((id) => server.db.escape(id)).join(', ')})`
    logSql(sql)
    return server.db.promise().query<ResultSetHeader>(sql, [this.user.id])
  }
  list(offset?: number, limit?: number, wheres?: string[]) {
    let sql = `
      SELECT 
      f.owner_id, f.user_id, f.marked_name, f.created, u.username, 
      u.profile_pic, u.bio,
      CASE u.status
        WHEN u.status = 'hide'
          THEN 'offline'
        ELSE
          u.status
      END as 'status'
      FROM ${Friend.tableName} f
      LEFT JOIN ${User.tableName} u
      ON u.id = f.user_id
    `
    if (wheres) {
      sql += ' WHERE '
      sql += wheres.join(' AND ')
    }
    if (limit !== undefined) sql += ` LIMIT ${escape(limit)} `
    if (offset !== undefined) sql += ` OFFSET ${escape(offset)} `
    logSql(sql)
    return server.db.promise().query<FriendCls.ListResult>(sql)
  }
  total() {
    let sql = `
      SELECT COUNT(*) as total FROM ${Friend.tableName} f
      WHERE f.owner_id = ?
    `
    logSql(sql)
    return server.db.promise().query<({ total: number } & RowDataPacket)[]>(sql, [this.user.id])
  }
  listInChat(chatId: number) {
    const sql = `
      SELECT u.id, u.username, u.hash,
      CASE u.status
      WHEN u.status = 'hide'
        THEN 'offline'
      ELSE
        u.status
      END as 'status'
      FROM ${Friend.tableName} f
      INNER JOIN ${User.tableName} u
      ON u.id = f.user_id
      INNER JOIN ${Participant.tableName} p
      ON p.user_id = f.user_id
      WHERE p.chat_id = ?
      AND f.owner_id = ?
      ORDER BY FIELD(status, 'available', 'busy', 'leave')
    `
    logSql(sql)
    return server.db.promise().query<RowDataPacket[]>(sql, [chatId, this.user.id])
  }
  static tableName = 'friends'
}

export default Friend
