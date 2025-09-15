import { Roles } from '../../shared/enums/roles.enum';

export class UserResponseDto {
  id: number;
  username: string;
  email: string;
  role: Roles;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
