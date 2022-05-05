import { RequestHandler } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import logger from 'src/utils/logger'
import { uploadPath } from 'src/utils/multer'
import { v4 as uuidv4 } from 'uuid'
import { MyExpressCodeMap } from '../express.proto'

const mediaController: { [key: string]: RequestHandler } = {
  profilePic: async (req, res) => {
    try {
      const { profilePic } = req.params
      const ref = path.resolve(`${uploadPath}/users/${profilePic}.webp`)
      const result = fs.readFileSync(ref)
      res
        .status(200)
        .header({
          'Content-Type': 'image/webp'
        })
        .end(result)
    } catch (error) {
      console.log(error)
      res.status(400).header({
        'Content-Type': 'image/webp'
      })
    }
  },
  chatProfilePic: async (req, res) => {
    try {
      const { profilePic } = req.params
      const ref = path.resolve(`${uploadPath}/chats/${profilePic}.webp`)
      const result = fs.readFileSync(ref)
      res
        .status(200)
        .header({
          'Content-Type': 'image/webp'
        })
        .end(result)
    } catch (error) {
      console.log(error)
      res.status(400).header({
        'Content-Type': 'image/webp'
      })
    }
  },
  postProfilePic: async (req, res) => {
    try {
      const profilePic = req.file
      console.log(profilePic)
      const name = uuidv4()
      const ref = `${uploadPath}/chats/${name}.webp`
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
          res.status(400).json({
            code: MyExpressCodeMap.fatalError
          })
          return
        }
      }
      if (writeIcon) {
        res.status(200).json({
          code: MyExpressCodeMap.success,
          file: name
        })
        return
      }
      res.status(400).json({
        code: MyExpressCodeMap.notFound
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default mediaController
