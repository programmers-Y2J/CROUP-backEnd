import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors/custom-errors.js';

const userValidator = {
  join: (req: Request, res: Response, next: NextFunction) => {
    const { email, password, nickName } = req.body;

    if (!email) {
      const err = new ValidationError('이메일을 입력해 주세요', 400);
      return next(err);
    }
    if (!password) {
      const err = new ValidationError('비밀번호를 입력해 주세요', 400);
      return next(err);
    }
    if (!nickName) {
      const err = new ValidationError('닉네임을 입력해 주세요', 400);
      return next(err);
    }

    if (password.length < 4) {
      const err = new ValidationError('비밀번호는 최소 4글자 입니다', 400);
      return next(err);
    }

    if (nickName.length < 2) {
      const err = new ValidationError('닉네임은 최소 2글자 입니다', 400);
      return next(err);
    }

    next();
  },
};

export default userValidator;
