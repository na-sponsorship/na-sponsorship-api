import { Expose } from 'class-transformer';
import { UserRole } from '../roles.enum';

export class AddUserDTO {
  @Expose() readonly password: string;
  @Expose() readonly username: string;
  @Expose() readonly role: UserRole;
}
