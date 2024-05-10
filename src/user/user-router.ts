import express from 'express';
import UserController from './user-controller.js';

const userRouter = express.Router();

userRouter.post('/join', UserController.join);

userRouter.post('/login', UserController.login);

userRouter.post('/logout', UserController.logout);

export default userRouter;
