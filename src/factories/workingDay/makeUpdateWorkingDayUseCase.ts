import { UpdateWorkingDayUseCase } from '../../application/useCases/workingDay/UpdateWorkingDayUseCase';

export function makeUpdateWorkingDayUseCase() {
  return new UpdateWorkingDayUseCase();
}
