import { type IPermission } from '../interfaces/models/permission.interface'

export const PermissionsData: IPermission[] = [
    {
        name: 'Listar Usuario',
        code: 'LIST_USERS',
        description: 'Permitir listar los usuarios del sistema'
    },
    {
        name: 'Crear Usuario',
        code: 'CREATE_USER',
        description: 'Permitir crear un usuario'
    },
    {
        name: 'Asignar Rol',
        code: 'ASSIGN_ROLE',
        description: 'Permitir asignar roles a un usuario'
    },
    {
        name: 'Remover Rol',
        code: 'REMOVE_ROLE',
        description: 'Permitir remover roles a un usuario'
    },
    {
        name: 'Bloquear Usuario',
        code: 'LOCK_USER',
        description: 'Permitir bloquear usuarios'
    },
    {
        name: 'Desbloquear Usuario',
        code: 'UNLOCK_USER',
        description: 'Permitir desbloquear usuarios'
    },
    {
        name: 'Listar Roles',
        code: 'LIST_ROLES',
        description: 'Permitir consultar los roles'
    },
    {
        name: 'Ver Rol',
        code: 'SEE_ROLE',
        description: 'Permitir ver los detalles de un rol'
    },
    {
        name: 'Crear Roles',
        code: 'CREATE_ROLE',
        description: 'Permitir crear roles'
    },
    {
        name: 'Actualizar Roles',
        code: 'UPDATE_ROLE',
        description: 'Permitir actualizar roles'
    },
    {
        name: 'Eliminar Roles',
        code: 'DELETE_ROLE',
        description: 'Permitir eliminar roles no utilizados'
    },
    {
        name: 'Asignar Permisos a Roles',
        code: 'ASSIGN_PERMISSIONS_TO_ROLES',
        description: 'Permitir asignar permisos a los roles'
    },
    {
        name: 'Quitar Permisos a Roles',
        code: 'REMOVE_PERMISSIONS_TO_ROLES',
        description: 'Permitir quitar los permisos a los roles'
    },
    {
        name: 'Listar Permisos',
        code: 'LIST_PERMISSION',
        description: 'Permitir consultar los permisos'
    },
    {
        name: 'Ver Permiso',
        code: 'SEE_PERMISSION',
        description: 'Permitir ver los detalles de un permiso'
    },
    {
        name: 'Crear Permisos',
        code: 'CREATE_PERMISSION',
        description: 'Permitir crear permisos'
    },
    {
        name: 'Actualizar Permisos',
        code: 'UPDATE_PERMISSION',
        description: 'Permitir actualizar permisos'
    },
    {
        name: 'Eliminar Permisos',
        code: 'DELETE_PERMISSION',
        description: 'Permitir eliminar permisos no utilizados'
    }
]

export const RolesData = [
    {
        name: 'SuperAdmin',
        description: 'Usuario con acceso a todo el sistema protegido de bloqueos',
        permissions: []
    },
    {
        name: 'Admin',
        description: 'Usuario con acceso a todo el sistema',
        permissions: []
    }
]

export const RolesPermissionsData = [
    {
        role: 'Admin',
        permissions: [
            'LIST_USERS',
            'CREATE_USER',
            'ASSIGN_ROLE',
            'REMOVE_ROLE',
            'LOCK_USER',
            'UNLOCK_USER',
            'LIST_ROLES',
            'SEE_ROLE',
            'CREATE_ROLE',
            'UPDATE_ROLE',
            'DELETE_ROLE',
            'LIST_PERMISSION',
            'SEE_PERMISSION',
            'CREATE_PERMISSION',
            'UPDATE_PERMISSION',
            'DELETE_PERMISSION',
            'ASSIGN_PERMISSIONS_TO_ROLES',
            'REMOVE_PERMISSIONS_TO_ROLES'
        ]
    }
]
