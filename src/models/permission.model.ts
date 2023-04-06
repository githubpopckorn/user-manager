import { model, Schema } from 'mongoose'
import { type IPermission } from '../interfaces/models/permission.interface'

const permissionSchema = new Schema<IPermission>({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
}, {
    timestamps: true
})

// Virtuals
permissionSchema.virtual('roles', {
    ref: 'Rol',
    localField: '_id',
    foreignField: 'permissions',
    justOne: false,
    options: { sort: { createdAt: -1 } }
})

export const Permission = model<IPermission>('Permission', permissionSchema)
