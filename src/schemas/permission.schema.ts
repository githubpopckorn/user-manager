import Joi from 'joi'

export const PermissionSchemas = {
    list: Joi.object({
        pageSize: Joi.number().required().min(1),
        pageNum: Joi.number().required().min(1)
    }),
    get: Joi.object({
        id: Joi.string().hex().length(24).required()
            .label('Id')
            .messages({ 'string.hex': 'El campo {#label} debe ser un id válido', 'string.length': 'El campo {#label} debe ser un id válido' })
    }),
    permission: Joi.object({
        name: Joi.string().required()
            .label('Nombre')
            .min(5)
            .max(50)
            .messages({ 'any.required': 'El campo {#label} es requerido' }),
        description: Joi.string().required()
            .label('Descripción')
            .min(5)
            .max(200)
            .messages({ 'any.required': 'El campo {#label} es requerido' }),
        code: Joi.string().required()
            .label('Código')
            .min(5)
            .max(30)
            .messages({ 'any.required': 'El campo {#label} es requerido' })
    })
}
