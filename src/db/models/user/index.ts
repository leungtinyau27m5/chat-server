import { escape, ResultSetHeader } from 'mysql2'
import server from 'src/db/server'
import Brcypt from 'src/utils/brcypt'
import { logSql } from 'src/utils/logger'
import { DB } from '../db.proto'
import { UserCls } from './user.proto'
import { v4 as uuidv4 } from 'uuid'

class User {
  id
  constructor(id: number) {
    this.id = id
  }

  jwt() {}
  update(data: Partial<Pick<DB.Schema.User, 'username' | 'password' | 'profile_pic' | 'bio' | 'status'>>) {
    let sql = `
      UPDATE ${User.tableName} 
      SET
    `
    sql += Object.entries(data)
      .map(([key, value]) => `${key}=${escape(value)}`)
      .join(', ')
    sql += ` WHERE id = ? `
    return server.db.promise().query<ResultSetHeader>(sql, [this.id])
  }

  static tableName = 'users'
  static create(data: Pick<DB.Schema.User, 'username' | 'email' | 'password' | 'profile_pic' | 'bio'>) {
    const sql = `
      INSERT INTO ${User.tableName}
        (username, email, hash, password, profile_pic, bio, status)
      VALUES
        (?, ?, ?, ?, ?, ?, 'offline')
    `
    logSql(sql)
    return server.db
      .promise()
      .query<ResultSetHeader>(sql, [
        data.username,
        data.email,
        uuidv4(),
        Brcypt.hash(data.password),
        data.profile_pic,
        data.bio
      ])
  }
  static login(email: string) {
    const sql = `
      SELECT * FROM ${User.tableName} u
      WHERE u.email = ?
      LIMIT 1
    `
    logSql(sql)
    return server.db.promise().query<UserCls.LoginResult>(sql, [email])
  }
  static list(rows: { userId?: number; email?: string; hash?: string }[]) {
    let sql = `
      SELECT u.id, u.email, u.hash, u.status FROM ${User.tableName} u
    `
    let ids: number[] = []
    let emails: string[] = []
    let hashs: string[] = []
    rows.forEach((ele) => {
      if (ele.userId) ids.push(ele.userId)
      if (ele.email) emails.push(ele.email)
      if (ele.hash) hashs.push(ele.hash)
    })
    if (ids.length || emails.length || hashs.length) sql += ' WHERE '
    if (ids.length) {
      sql += `u.id IN (${ids.map((id) => server.db.escape(id)).join(', ')})`
      if (emails.length) sql += ' OR '
    }
    if (emails.length) {
      sql += `u.email IN (${emails.map((email) => server.db.escape(email)).join(', ')})`
    }
    if (hashs.length) {
      sql += `u.hash IN (${hashs.map((hash) => escape(hash)).join(', ')})`
    }
    return server.db.promise().query<UserCls.ListResult>(sql)
  }

  static get(data: { hash?: string; id?: number; email?: string }) {
    let sql = `
      SELECT u.id, u.email, u.hash
    `
  }
}

export default User
