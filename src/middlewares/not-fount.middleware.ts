import { Request, Response, NextFunction } from 'express';

export const NotFoundMiddleware = (_req: Request, res: Response, _next: NextFunction) =>
    res.status(400).send({ status: 404, message: "Recurso no encontrado" });