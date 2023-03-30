import { type supportedRoles } from '../config/constants'

export type SupportedRoles = keyof typeof supportedRoles

export enum SupportedRolesEnum {
    ADMIN = 'Admin',
    PROVEEDOR = 'Proveedor'
}
