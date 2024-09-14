import { CreateHolidayExceptionUseCase } from '../../application/useCases/holidayException/CreateHolidayExceptionUseCase';

export function makeCreateHolidayExceptionUseCase() {
  return new CreateHolidayExceptionUseCase();
}
