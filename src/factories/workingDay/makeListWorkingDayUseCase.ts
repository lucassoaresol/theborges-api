import { ListWorkingDayUseCase } from '../../application/useCases/workingDay/ListWorkingDayUseCase';

export function makeListWorkingDayUseCase() {
  return new ListWorkingDayUseCase();
}
