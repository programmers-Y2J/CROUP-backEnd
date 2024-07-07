import express from 'express';
import userController from './user-controller.js';
import userErrorHandler from './user-error-handler.js';
import authMiddleware from '../token/auth-middleware.js';

const userRouter = express.Router();

userRouter.post('/join', userController.join);

userRouter.post('/login', userController.login);

userRouter.post('/logout', userController.logout);

userRouter.put('/change/name', authMiddleware, userController.replaceName);

userRouter.put('/change/password', authMiddleware, userController.replacePwd);

userRouter.use(userErrorHandler.catch);

export default userRouter;
