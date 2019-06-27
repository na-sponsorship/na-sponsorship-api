import { IsNotEmpty } from 'class-validator';

export class requestCodeDTO {
  @IsNotEmpty()
  readonly email: string;
}
