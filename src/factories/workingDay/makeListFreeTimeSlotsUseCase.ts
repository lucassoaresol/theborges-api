import { ListFreeTimeSlotsUseCase } from '../../application/useCases/workingDay/ListFreeTimeSlotsUseCase';

export function makeListFreeTimeSlotsUseCase() {
  return new ListFreeTimeSlotsUseCase();
}
