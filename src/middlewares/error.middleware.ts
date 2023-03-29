import { ErrorRequestHandler } from "express";

export const ErrorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
    const httpStatus = err.status || 500;

    console.log(err.stack)
    res.status(httpStatus).send({
        status: httpStatus,
        message: err.message || "Internal Server Error",
    })
}
