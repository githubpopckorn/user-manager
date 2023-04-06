import type Joi from 'joi'
import { type Request, type Response, type NextFunction } from 'express'
import { type RequestParams } from '../types/types'

export const ValidateRequest = (schema: Joi.ObjectSchema, property: RequestParams) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[property])
        console.log(error?.details)
        if (error === undefined || error === null) {
            next()
        } else {
            const { details } = error
            const message = details.map((i) => i.message).join(',')
            const context = details.map((i) => i.context)
            console.log('error', message)

            res.status(422).json({ success: false, error: message, context })
        }
    }
}
