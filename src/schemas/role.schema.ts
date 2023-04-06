import Joi from 'joi'

export const RoleSchemas = {
    role: Joi.object({
        name: Joi.string().required()
            .label('Nombre')
            .min(5)
            .max(20)
            .messages({ 'any.required': 'El campo {#label} es requerido' }),
        description: Joi.string().required()
            .label('Descripción')
            .min(5)
            .max(100)
            .messages({ 'any.required': 'El campo {#label} es requerido' })
    }),
    get: Joi.object({
        id: Joi.string().hex().length(24).required()
        .label('Id')
        .messages({ 'string.hex': 'El campo {#label} debe ser un id válido', 'string.length': 'El campo {#label} debe ser un id válido' })
    })
}
