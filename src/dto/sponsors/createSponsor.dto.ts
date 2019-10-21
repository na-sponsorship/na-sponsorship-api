import { Expose, Type } from 'class-transformer';

import { SponsorDTO } from './sponsor.dto';
import { PaymentDTO } from './payment.dto';

export class CreateSponsorDTO {
  @Expose() readonly childId: number;

  @Expose()
  @Type(() => SponsorDTO)
  readonly sponsor: SponsorDTO;

  @Expose()
  @Type(() => PaymentDTO)
  readonly payment: PaymentDTO;
}
