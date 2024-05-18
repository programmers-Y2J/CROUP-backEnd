import { ValidationError } from '../errors/custom-errors.js';

const userValidator = {
  join(email: string, password: string, nickName: string) {
    if (!email) {
      throw new ValidationError('이메일을 입력해 주세요', 400);
    }
    if (!password) {
      throw new ValidationError('비밀번호를 입력해 주세요', 400);
    }
    if (!nickName) {
      throw new ValidationError('닉네임을 입력해 주세요', 400);
    }

    if (password.length < 4) {
      throw new ValidationError('비밀번호는 최소 4글자 입니다', 400);
    }

    if (nickName.length < 2) {
      throw new ValidationError('닉네임은 최소 2글자 입니다', 400);
    }
  },

  login(email: string, password: string) {
    if (!email) {
      throw new ValidationError('이메일을 입력해 주세요', 400);
    }
    if (!password) {
      throw new ValidationError('비밀번호를 입력해 주세요', 400);
    }
  },
};

export default userValidator;
