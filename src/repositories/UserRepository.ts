import { User } from '../models';
import { UserCreationAttributes } from '../models/User';

export class UserRepository {
  async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.scope('withPassword').findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await User.count({
      where: { email: email.toLowerCase() },
    });

    return count > 0;
  }
}

export const userRepository = new UserRepository();
