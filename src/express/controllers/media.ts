import { RequestHandler } from 'express'
import fs from 'fs'
import path from 'path'
import { uploadPath } from 'src/utils/multer'

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
    }
  }
}

export default mediaController
