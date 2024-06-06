import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const tokenManager = {
  create(userId: string, nickName: string) {
    const payload = { userId, nickName };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { algorithm: 'HS512' });
    return token;
  },

  verify(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
};

export default tokenManager;
