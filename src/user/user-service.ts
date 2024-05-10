import { AppDataSource } from '../../config/db/data-source.js';
import { User } from '../../config/db/entity/User.js';

class UserService {
  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  joinUser() {}

  login() {}

  logout() {}
}

export default UserService;
