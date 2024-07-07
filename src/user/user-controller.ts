import { Request, Response, NextFunction } from 'express';
import ResTemplate from '../template/res-template.js';
import tokenManager from '../token/token-manager.js';
import userService from './user-service.js';
import userValidator from './user-validator.js';
import { ValidationError } from '../errors/custom-errors.js';
import resTemplate from '../template/res-template.js';

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
      const token = tokenManager.create(user._id.toString(), user.nickName.toString());
      res.status(200).json({ userId: user._id, nickName: user.nickName, token: token });
    } catch (e) {
      next(e);
    }
  },

  logout() {},

  async replaceName(req: Request, res: Response, next: NextFunction) {
    const { newName } = req.body;
    const user = req.user!;

    if (!newName) {
      const err = new ValidationError('새로운 닉네임을 입력해 주세요', 400);
      return next(err);
    }

    try {
      const afterUser = await userService.replaceUserInfo('name', user.userId, newName);
      res.status(200).json({ userId: afterUser._id, nickName: afterUser.nickName });
    } catch (e) {
      next(e);
    }
  },

  async replacePwd(req: Request, res: Response, next: NextFunction) {
    const { newPassword, email } = req.body;
    const user = req.user!;

    if (!newPassword) {
      const err = new ValidationError('새로운 비밀번호를 입력해 주세요', 400);
      return next(err);
    }

    if (!email) {
      const err = new ValidationError('이메일을 입력해 주세요', 400);
      return next(err);
    }

    try {
      const validateUser = await userService.getUserByEmail(email);
      if (validateUser._id.toString() !== user.userId) {
        throw new ValidationError('이메일이 일치하지 않습니다', 400);
      }
      await userService.replaceUserInfo('pwd', user.userId, newPassword);
      res.status(200).json(resTemplate.JSON(true, '비밀번호 변경 완료'));
    } catch (e) {
      next(e);
    }
  },
};

export default userController;
