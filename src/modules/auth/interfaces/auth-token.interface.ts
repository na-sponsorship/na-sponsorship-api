import { UserRole } from '../roles.enum';

export interface IAuthToken {
  username: string;
  name: string;
  id: number;
  role: UserRole;
}
