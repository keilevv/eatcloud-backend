import { UserResponseDto } from '../dto/auth/UserResponse.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto;
    }
  }
}

export {};
