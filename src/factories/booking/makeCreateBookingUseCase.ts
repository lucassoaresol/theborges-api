import { CreateBookingUseCase } from '../../application/useCases/booking/CreateBookingUseCase';
import { PublicIdGenerator } from '../../utils/PublicIdGenerator';

export function makeCreateBookingUseCase() {
  const publicIdGenerator = new PublicIdGenerator();

  const TEMPLATE_NAME = {
    new: 'NEW_BOOKING',
    new_person: 'NEW_BOOKING_PERSON',
  };
  return new CreateBookingUseCase(publicIdGenerator, TEMPLATE_NAME);
}
