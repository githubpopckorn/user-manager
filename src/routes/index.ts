import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { ErrorMiddleware, NotFoundMiddleware } from '../middlewares'
require("express-async-errors");

export default ({ UserRoute }: { UserRoute: Router }) => {
    const router = express.Router();
    const apiRoutes = express.Router();

    apiRoutes
        .use(express.json())
        .use(cors())
        .use(helmet())
        .use(compression())

    // Api routes
    apiRoutes.use("/user", UserRoute);
    router.use("/api/v1", apiRoutes);

    // Middlewares
    router.use(NotFoundMiddleware)
    router.use(ErrorMiddleware);
    return router;

}