import { IsNotEmpty } from 'class-validator';

export class VerifyCodeDTO {
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly code: string;
}
