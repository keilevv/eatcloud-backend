import { ERROR_MESSAGES, HTTP_STATUS } from '../constants';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
  UserResponseDto,
} from '../dto';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/app-error';
import { generateAccessToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(data: RegisterRequestDto): Promise<UserResponseDto> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const emailExists = await this.userRepository.emailExists(normalizedEmail);

    if (emailExists) {
      throw new AppError(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return this.toUserResponse(user);
  }

  async login(data: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.validateCredentials(data.email, data.password);
    const token = this.generateJwt(user.id, user.email);

    return {
      token,
      user: this.toUserResponse(user),
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return this.toUserResponse(user);
  }

  private async validateCredentials(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string; name: string; password: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    return user;
  }

  private generateJwt(userId: string, email: string): string {
    return generateAccessToken({ userId, email });
  }

  private toUserResponse(user: {
    id: string;
    name: string;
    email: string;
  }): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

export const authService = new AuthService(new UserRepository());
