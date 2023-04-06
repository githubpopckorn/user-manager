import mongoose from 'mongoose'
import { type IRole } from '../interfaces/models/role.interface'
import * as autopopulate from 'mongoose-autopopulate'
const { Schema, model } = mongoose

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  permissions: [{
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Permission',
    autopopulate: { select: 'name code description _id' }
  }]
}, {
  timestamps: true
})

/** Virtuals */
roleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'roles',
  justOne: false,
  options: { sort: { createdAt: -1 } }
})

/** Methods */
roleSchema.methods.toJSON = function () {
  const roleObject = this.toObject()
  delete roleObject.createdAt
  delete roleObject.updatedAt
  delete roleObject.__v
  return roleObject
}

roleSchema.plugin(autopopulate.default)
export const Role = model<IRole>('Role', roleSchema)
