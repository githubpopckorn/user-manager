import { type NextFunction, type Request, type ErrorRequestHandler, type Response } from 'express'
import { type HttpError } from '../exceptions/http.error'

export const ErrorMiddleware: ErrorRequestHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const httpStatus: number = (err.status !== undefined) ? err.status : 500

  console.log(err.stack)
  res.status(httpStatus).send({
    success: false,
    status: httpStatus,
    message: (err.message.length > 0) ? err.message : 'Internal Server Error'
  })
}
