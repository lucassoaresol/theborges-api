import { UpdateBookingController } from '../../application/controllers/booking/UpdateBookingController.js';

import { makeUpdateBookingUseCase } from './makeUpdateBookingUseCase.js';

export function makeUpdateBookingController() {
  const updateBookingUseCase = makeUpdateBookingUseCase();

  return new UpdateBookingController(updateBookingUseCase);
}
