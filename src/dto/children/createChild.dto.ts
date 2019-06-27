import { IsNotEmpty } from 'class-validator';

export class CreateChildDTO {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;
}
