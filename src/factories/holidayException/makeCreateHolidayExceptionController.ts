import { CreateHolidayExceptionController } from '../../application/controllers/holidayException/CreateHolidayExceptionController.js';

import { makeCreateHolidayExceptionUseCase } from './makeCreateHolidayExceptionUseCase.js';

export function makeCreateHolidayExceptionController() {
  const createHolidayExceptionUseCase = makeCreateHolidayExceptionUseCase();

  return new CreateHolidayExceptionController(createHolidayExceptionUseCase);
}
