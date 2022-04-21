export declare module DB {
  namespace Schema {
    type UserStatus = 'available' | 'busy' | 'leave' | 'hide' | 'offline'
    type ChatType = 'private' | 'group'
    type ParticipantRole = 'owner' | 'admin' | 'member' | 'listener'
    type MessageMetaType = 'video' | 'image'
    interface User {
      id: number
      username: string // 20
      email: string // 255
      password: string
      status: UserStatus
      profile_pic: null | string // 2048
      bio: null | string // 255
      created: string
      updated: string
    }
    interface Chat {
      id: number
      name: string //20
      type: ChatType
      bio: null | string // 255
      profile_pic: null | string
      created: string
      updated: string
    }
    interface Participant {
      chat_id: number
      user_id: number
      role: ParticipantRole
      last_seen: string | null
      created: string
      updated: string
    }
    interface Friend {
      owner_id: number
      user_id: number
      marked_name: string // 20
      created: string
    }
    interface Message {
      id: number
      sender_id: number
      chat_id: number
      message: string | null
      media: string | null // 2048
      meta: {
        type?: MessageMetaType
        description?: string
        reply?: number
      } | null //json?
      deleted: boolean
      created: string
      updated: string
    }
  }
}
