import { Router, Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares';
import { UserService } from '../services';

export default  ({ UserService }: {UserService: UserService}) => {
    const router = Router();

    router.post('/signUp', async (req, res) => {
        const user = req.body;
        const createdUser = await UserService.create(user);
        res.status(201).send(createdUser);
    })

    router.post("/signIn", async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await UserService.signIn(email, password);
        console.log(user);
        res.status(200).send(user);
    });

    router.post("/signOut", [AuthMiddleware], async (req: Request, res: Response) => {
        const user = req.user!;
        const token = req.token;
        const signOut = await UserService.signOut(user, token);
        res.status(201).send(signOut);
    });

    router.post('/signOutAll', [AuthMiddleware], async (req: Request, res: Response) => {
        const user = req.user!;
        const loggedOutAll = await UserService.signOutAll(user);
        res.status(201).send(loggedOutAll);
    })

    return router;
}