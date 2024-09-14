import { RetrieveWorkingDayUseCase } from '../../application/useCases/workingDay/RetrieveWorkingDayUseCase';

export function makeRetrieveWorkingDayUseCase() {
  return new RetrieveWorkingDayUseCase();
}
