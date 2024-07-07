import { AppDataSource } from '../../config/db/data-source.js';
import { User } from '../../config/db/entity/User.js';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors/custom-errors.js';
import { ObjectId } from 'mongodb';

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

  async getUserByEmail(email: string) {
    const user = await AppDataSource.mongoManager.findOne(User, { where: { email } });
    if (!user) {
      throw new NotFoundError('유저를 찾을 수 없습니다', 404);
    }
    return user;
  },

  async replaceUserInfo(target: 'name' | 'pwd', id: string, replaceData: string) {
    const user = await AppDataSource.mongoManager.findOne(User, { where: { _id: new ObjectId(id) } });

    if (!user) {
      throw new NotFoundError('유저가 존재하지 않습니다 토큰을 다시 받으세요', 404);
    }

    if (target === 'name') {
      user.nickName = replaceData;
    }

    if (target === 'pwd') {
      const hashPwd = await bcrypt.hash(replaceData, 12);
      user.password = hashPwd;
    }

    return AppDataSource.mongoManager.save(user);
  },
};

export default userService;
