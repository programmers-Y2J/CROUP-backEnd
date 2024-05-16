import { Request, Response, NextFunction } from 'express';
import ResTemplate from '../template/res-template.js';
import UserService from './user-service.js';

class UserController {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  async join(req: Request, res: Response, next: NextFunction) {
    const { email, password, nickName } = req.body;

    try {
      await this.userService.joinUser(email, password, nickName);
      res.status(201).json(ResTemplate.JSON(true, 'Created'));
    } catch (e) {
      next(e);
    }
  }

  login() {}

  logout() {}
}

export default UserController;
