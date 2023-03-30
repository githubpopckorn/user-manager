import { type supportedRoles } from '../config/constants'

export type SupportedRoles = keyof typeof supportedRoles

export enum SupportedRolesEnum {
    SUPERADMIN = 'SuperAdmin',
    ADMIN = 'Admin',
    PROVEEDOR = 'Proveedor'
}
