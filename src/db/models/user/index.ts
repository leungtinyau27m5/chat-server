import { ResultSetHeader } from 'mysql2'
import server from 'src/db/server'
import Brcypt from 'src/utils/brcypt'
import { logSql } from 'src/utils/logger'
import Friend from '../friend'
import { DB } from '../db.proto'
import { UserCls } from './user.proto'

class User {
  id
  constructor(id: number) {
    this.id = id
  }

  jwt() {}
  update() {}

  static tableName = 'users'
  static create(data: Pick<DB.Schema.User, 'username' | 'email' | 'password' | 'profile_pic' | 'bio'>) {
    const sql = `
      INSERT INTO ${User.tableName} u
        (username, email, password, profile_pic, bio, status)
      VALUES
        (?, ?, ?, ?, ?, 'offline')
    `
    logSql(sql)
    return server.db
      .promise()
      .query<ResultSetHeader>(sql, [data.username, data.email, Brcypt.hash(data.password), data.profile_pic, data.bio])
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
  static list(rows: { id?: number; email?: string }[]) {
    let sql = `
      SELECT u.id, u.email, u.status FROM ${User.tableName} u
      WHERE 
    `
    let ids: number[] = []
    let emails: string[] = []
    rows.forEach((ele) => {
      if (ele.id) ids.push(ele.id)
      if (ele.email) emails.push(ele.email)
    })
    if (ids.length) {
      sql += `u.id IN (${ids.map((id) => server.db.escape(id)).join(', ')})`
      if (emails.length) sql += ' OR '
    }
    if (emails.length) {
      sql += `u.email IN (${emails.map((email) => server.db.escape(email)).join(', ')})`
    }
    return server.db.promise().query<UserCls.ListResult>(sql)
  }
}

export default User
