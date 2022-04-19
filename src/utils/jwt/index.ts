import jsonwebtoken, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { privateKey, publicKey } from 'src/constants/rsaKeys'
import { DB } from 'src/db/models/db.proto'

export interface JwtResponse extends JwtPayload, Omit<DB.Schema.User, 'password'> {}

interface SuccessVerfiy {
  error: null
  data: JwtResponse
}

interface FailVerify {
  error: VerifyErrors
  data: null
}

export const jwtSign = (data: any) => {
  return jsonwebtoken.sign(data, privateKey, {
    issuer: process.env.jwt_issure,
    subject: process.env.jwt_subject,
    expiresIn: '30d',
    algorithm: 'RS256'
  })
}

export const jwtVerify = (token: string) => {
  return new Promise<SuccessVerfiy | FailVerify>((resolve) => {
    jsonwebtoken.verify(
      token,
      publicKey,
      {
        issuer: process.env.jwt_issure,
        subject: process.env.jwt_subject,
        algorithms: ['RS256']
      },
      (error, decoded) => {
        if (error) {
          resolve({
            error,
            data: null
          })
        } else {
          resolve({
            error: null,
            data: decoded as JwtResponse
          })
        }
      }
    )
  })
}
