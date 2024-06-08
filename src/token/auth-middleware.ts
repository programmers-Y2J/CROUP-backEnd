import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: '로그인을 해주세요' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; nickName: string  };
    req.user = { userId: decoded.userId, nickName: decoded.nickName };
    next();
  } catch (error) {
    return res.status(401).json({ error: '토큰을 찾을 수 없습니다.' });
  }
};

export default authMiddleware;