import { IsNotEmpty } from 'class-validator';

export class createSponsorDTO {
  @IsNotEmpty()
  readonly email: string;
}
