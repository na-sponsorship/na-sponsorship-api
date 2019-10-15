import { Expose } from 'class-transformer';

export class AddUserDTO {
  @Expose() readonly password: any;
  @Expose() readonly username: any;
}
