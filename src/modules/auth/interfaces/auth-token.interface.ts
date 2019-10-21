import { UserRole } from '../roles.enum';

export interface IAuthToken {
  username: string;
  id: number;
  role: UserRole;
}
