import { RequestHandler } from 'express'
import path from 'path'
import userService from 'src/db/controllers/userService'
import User from 'src/db/models/user'
import { getSimpleError, imageFilter } from 'src/helpers/common'
import { JwtResponse, jwtSign } from 'src/utils/jwt'
import { MyExpressCodeMap } from '../express.proto'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { uploadPath } from 'src/utils/multer'
import logger from 'src/utils/logger'

const userController: { [key: string]: RequestHandler } = {
  get: async (req, res) => {
    const decoded = req.body.decoded as JwtResponse
    console.log(decoded)
    const result = await User.login(decoded.email)
    if (result[0].length === 1) {
      const { password, ...data } = result[0][0]
      res.status(200).json({
        code: MyExpressCodeMap.success,
        message: 'user verified',
        data
      })
      return
    }
    res.status(401).json({
      code: MyExpressCodeMap.invalidJwt,
      message: 'user verification fail'
    })
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
          code: MyExpressCodeMap.invalidParameter,
          message: 'password or email is empty'
        })
        return
      }
      const result = await userService.login(email, password)
      const token = jwtSign(result)
      if (result !== null) {
        res.status(200).json({
          code: MyExpressCodeMap.success,
          message: 'success',
          data: result,
          token
        })
        return
      }
      res.status(400).json({
        code: MyExpressCodeMap.notFound,
        message: 'password or email is invalid'
      })
    } catch (error) {
      const message = getSimpleError(error)
      res.status(500).json({
        code: MyExpressCodeMap.fatalError,
        message
      })
    }
  },
  register: async (req, res) => {
    try {
      const { username, email, password, bio = null } = req.body
      if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
          code: MyExpressCodeMap.invalidParameter,
          message: 'invalid parameters'
        })
        return
      }
      const profilePic = req.file
      const name = uuidv4()
      const ref = `${uploadPath}/users/${name}.webp`
      let writeIcon = false
      if (profilePic) {
        try {
          await sharp(profilePic.buffer)
            .webp({
              quality: 80
            })
            .toFile(path.resolve(ref))
          writeIcon = true
        } catch (error) {
          logger.error(error)
        }
      }
      const result = await userService.register({
        username,
        email,
        password,
        profile_pic: writeIcon ? name : null,
        bio
      })
      if (result[0].insertId) {
        res.status(200).json({
          code: MyExpressCodeMap.success,
          message: 'register succeed'
        })
        return
      }
      res.status(400).json({
        code: MyExpressCodeMap.invalidParameter,
        message: 'unknown parameters'
      })
    } catch (error) {
      const message = getSimpleError(error)
      res.status(500).json({
        code: MyExpressCodeMap.fatalError,
        message
      })
    }
  },
  testFileUpload: async (req, res) => {
    const image = req.file
    console.log('image: ', image)
    if (!image) {
      res.status(200).json({
        message: 'done'
      })
      return
    }
    try {
      const result = await sharp(image?.buffer)
        .webp({
          quality: 80
        })
        .toFile(path.resolve(uploadPath + '95727' + '.webp'))
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }
}

export default userController
