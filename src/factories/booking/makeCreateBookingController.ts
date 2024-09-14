import { CreateBookingController } from '../../application/controllers/booking/CreateBookingController.js';

import { makeCreateBookingUseCase } from './makeCreateBookingUseCase.js';

export function makeCreateBookingController() {
  const createBookingUseCase = makeCreateBookingUseCase();

  return new CreateBookingController(createBookingUseCase);
}
