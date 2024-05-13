import { AppDataSource } from '../../config/db/data-source.js';
import { User } from '../../config/db/entity/User.js';
import bcrypt from 'bcrypt';

class UserService {
  private mongoManager;

  constructor() {
    this.mongoManager = AppDataSource.mongoManager;
  }

  async joinUser(email: string, password: string, nickName: string) {
    const hashPwd = await this.hashing(password);
    return this.mongoManager.insert(User, { email, password: hashPwd, nickName });
  }

  login() {}

  logout() {}

  private async hashing(password: string) {
    const hashPwd = await bcrypt.hash(password, 12);
    return hashPwd;
  }
}

const userService = new UserService();

export default userService;
