import Joi from 'joi'

export const UserSchemas = {
    signUp: Joi.object({
        name: Joi.string().required()
            .label('Nombre')
            .messages({ 'any.required': 'El campo {#label} es requerido' }),
        email: Joi.string().email().required()
            .label('Email')
            .messages({ 'any.required': 'El campo {#label} es requerido', 'string.email': 'El campo {#label} debe ser un email válido' }),
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required()
    }),
    list: Joi.object({
        pageSize: Joi.number().required(),
        pageNum: Joi.number().required()
    }),
    signIn: Joi.object({
        email: Joi.string().email().required()
            .label('Email')
            .messages({ 'any.required': 'El campo {#label} es requerido', 'string.email': 'El campo {#label} debe ser un email válido' }),
        password: Joi.string().required()
            .label('Contraseña')
            .messages({ 'any.reqired': 'El campo {#label} es requerido' })
    }),
    emailSchema: Joi.object({
        email: Joi.string().email().required().label('Email').messages({ 'any.required': 'El campo {#label} es requerido', 'string.email': 'El campo {#label} debe ser un email válido' })
    }),
    resetPassword: Joi.object({
        password: Joi.string().required().label('Contraseña').messages({ 'any.required': 'El campo {#label} es requerido' }),
        confirmPassword: Joi.string().required().label('Confirmar contraseña').messages({ 'any.required': 'El campo {#label} es requerido' }),
        token: Joi.string().required().label('Token').messages({ 'any.required': 'El campo {#label} es requerido' })
    })
}
