import { UserResponseDto } from './UserResponse.dto';

export interface AuthResponseDto {
  token: string;
  user: UserResponseDto;
}
