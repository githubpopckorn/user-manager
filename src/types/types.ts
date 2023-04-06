import { type supportedRoles, type SupportedPermissionsEnum } from '../config/constants'

export type SupportedRoles = keyof typeof supportedRoles

export type SupportedPermissions = keyof typeof SupportedPermissionsEnum

export type RequestParams = keyof typeof RequestParamsEnum

export enum SupportedRolesEnum {
    SUPERADMIN = 'SuperAdmin',
    ADMIN = 'Admin',
    PROVEEDOR = 'Proveedor'
}

export enum RequestParamsEnum {
    body = 'body',
    query = 'query',
    params = 'params'
}
