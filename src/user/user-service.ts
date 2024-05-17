import { AppDataSource } from '../../config/db/data-source.js';
import { User } from '../../config/db/entity/User.js';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors/custom-errors.js';

const userService = {
  async joinUser(email: string, password: string, nickName: string) {
    const hashPwd = await bcrypt.hash(password, 12);
    return AppDataSource.mongoManager.insert(User, { email, password: hashPwd, nickName });
  },

  async login(email: string, password: string) {
    const user = await AppDataSource.mongoManager.findOne(User, { where: { email } });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
      throw new NotFoundError('이메일 또는 비밀번호가 틀립니다', 404);
    }

    throw new NotFoundError('이메일 또는 비밀번호가 틀립니다', 404);
  },

  logout() {},
};

export default userService;
