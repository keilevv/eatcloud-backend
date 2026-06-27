import { UserResponseDto } from '../dto/UserResponse.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserResponseDto;
    }
  }
}

export {};
