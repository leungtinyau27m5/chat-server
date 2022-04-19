import { compareSync, hashSync } from 'bcrypt'

class Brcypt {
  static hash(str: string) {
    return hashSync(str, 10)
  }
  static compare(str: string, encrypted: string) {
    return compareSync(str, encrypted)
  }
}

export default Brcypt
