import { SponsorDTO } from './sponsor.dto';
import { PaymentDTO } from './payment.dto';

export class CreateSponsorDTO {
  readonly childId: number;
  readonly sponsor: SponsorDTO;
  readonly payment: PaymentDTO;
}
