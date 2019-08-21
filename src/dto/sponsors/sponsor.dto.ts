import { AddressDTO } from '../address.dto';

export class SponsorDTO {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly address: AddressDTO;
}
