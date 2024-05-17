import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const tokenManager = {
  create(userId: string) {
    const token = jwt.sign(userId, process.env.JWT_SECRET!, { algorithm: 'HS512' });
    return token;
  },

  verify() {},
};

export default tokenManager;
