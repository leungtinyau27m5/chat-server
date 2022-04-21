import { RequestHandler } from 'express'
import { jwtVerify } from 'src/utils/jwt'
import { MyExpressCodeMap } from '../express.proto'

export const expressVerifyJwt: RequestHandler = async (req, res, next) => {
  const { jwt } = req.cookies
  const result = await jwtVerify(jwt)
  if (result.error) {
    res.status(401).json({
      code: MyExpressCodeMap.invalidJwt,
      message: result.error.message
    })
    return
  }
  req.body.decoded = result.data
  next()
}
