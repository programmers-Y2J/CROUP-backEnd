import { Request, Response, NextFunction } from 'express';
import userService from './user-service.js';
import ResTemplate from '../template/res-template.js';

class UserController {
  static async join(req: Request, res: Response, next: NextFunction) {
    const { email, password, nickName } = req.body;

    try {
      await userService.joinUser(email, password, nickName);
      res.status(201).json(ResTemplate.JSON(true, 'Created'));
    } catch (e) {
      next(e);
    }
  }

  static login() {}

  static logout() {}
}

export default UserController;
