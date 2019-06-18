import { IsNotEmpty } from 'class-validator';

export class CreateChildDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;
}
