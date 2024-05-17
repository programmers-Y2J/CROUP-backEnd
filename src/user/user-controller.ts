import e, { Request, Response, NextFunction } from 'express';
import ResTemplate from '../template/res-template.js';
import tokenManager from '../token/token-manager.js';
import userService from './user-service.js';
import userValidator from './user-validator.js';

const userController = {
  async join(req: Request, res: Response, next: NextFunction) {
    const { email, password, nickName } = req.body;

    try {
      userValidator.join(email, password, nickName);
      await userService.joinUser(email, password, nickName);
      res.status(201).json(ResTemplate.JSON(true, 'Created'));
    } catch (e) {
      next(e);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      userValidator.login(email, password);
      const user = await userService.login(email, password);
      const token = tokenManager.create(user.id.toString());
      res.cookie('tk', token);
      res.status(200).json({ userId: user.id, nickName: user.nickName });
    } catch (e) {
      next(e);
    }
  },

  logout() {},
};

export default userController;
