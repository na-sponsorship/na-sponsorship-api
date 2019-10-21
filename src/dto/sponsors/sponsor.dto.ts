import { AddressDTO } from '../address.dto';
import { Expose } from 'class-transformer';

export class SponsorDTO {
  @Expose() readonly firstName: string;
  @Expose() readonly lastName: string;
  @Expose() readonly email: string;
  @Expose() readonly address: AddressDTO;
}
