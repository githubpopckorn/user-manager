import mongoose from 'mongoose'
import { compareSync, hashSync, genSaltSync } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Config } from '../config'
import { type IUser } from '../interfaces/models/user.interface'
import { HttpError } from '../exceptions/http.error'
import * as autopopulate from 'mongoose-autopopulate'
const { Schema, model } = mongoose

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, trim: true, lowercase: true },
  username: { type: String, unique: true, trim: true, lowercase: true },
  password: { type: String, require: true, minlength: 7, trim: true },
  avatar: { type: Buffer },
  tokens: [{ token: { type: String } }],
  hasAvatar: { type: Boolean, default: false },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role',
    require: true,
    autopopulate: { select: 'name description _id' }
  }]
}, {
  timestamps: true
})

// Methods
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}

userSchema.methods.comparePasswords = async function (password: string) {
  return compareSync(password, this.password)
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = sign({ user }, Config.JWT_SECRET, { expiresIn: '4h' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.methods.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email })
  if (user == null) {
    const error = new HttpError(400, 'No se encontró el usuario')
    throw error
  }

  const isMatch = compareSync(password, user.password)
  if (!isMatch) {
    const error = new HttpError(400, 'Usuario o clave incorrectos')
    throw error
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    const salt = genSaltSync(10)
    const hashedPassword = hashSync(user.password, salt)
    user.password = hashedPassword
    next()
  }
  next()
})

userSchema.plugin(autopopulate.default)
export const User = model<IUser>('User', userSchema)
