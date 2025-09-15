import { Roles } from '../enums/roles.enum';

export interface ITokenPayload {
  id: number;
  role: Roles;
}
