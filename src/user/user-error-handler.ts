import { Response, Request, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import resTemplate from '../template/res-template.js';
import { MyError } from '../errors/custom-errors.js';

const userErrorHandler = {
  catch: (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MongoServerError && err.code === 11000) {
      return res.status(400).json(resTemplate.JSON(false, '이미 사용중인 이메일 또는 닉네임 입니다'));
    }

    if (err instanceof MyError) {
      return res.status(err.status).json(resTemplate.JSON(false, err.message));
    }

    console.error(err);
    res.status(500).json(resTemplate.JSON(false, '에러 발생 관리자에게 문의주세요'));
  },

  logging: () => {},
};

export default userErrorHandler;
