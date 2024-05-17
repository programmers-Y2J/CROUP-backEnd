import express from 'express';
import userController from './user-controller.js';
import userErrorHandler from './user-error-handler.js';

const userRouter = express.Router();

userRouter.post('/join', userController.join);

userRouter.post('/login', userController.login);

userRouter.post('/logout', userController.logout);

userRouter.use(userErrorHandler.catch);

export default userRouter;
