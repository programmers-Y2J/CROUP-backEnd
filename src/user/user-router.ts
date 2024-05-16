import express from 'express';
import UserController from './user-controller.js';
import userErrorHandler from './user-error-handler.js';
import userValidator from './user-validator.js';

const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/join', userValidator.join, userController.join);

userRouter.post('/login', userController.login);

userRouter.post('/logout', userController.logout);

userRouter.use(userErrorHandler.catch);

export default userRouter;
