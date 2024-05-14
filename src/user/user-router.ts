import express from 'express';
import UserController from './user-controller.js';
import UserErrorHandler from './user-error-handler.js';
import UserValidator from './user-validator.js';

const userRouter = express.Router();

userRouter.post('/join', UserValidator.join, UserController.join);

userRouter.post('/login', UserController.login);

userRouter.post('/logout', UserController.logout);

userRouter.use(UserErrorHandler.catch);

export default userRouter;
