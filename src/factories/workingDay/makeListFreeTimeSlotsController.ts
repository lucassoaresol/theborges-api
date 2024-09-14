import { ListFreeTimeSlotsController } from '../../application/controllers/workingDay/ListFreeTimeSlotsController.js';

import { makeListFreeTimeSlotsUseCase } from './makeListFreeTimeSlotsUseCase.js';

export function makeListFreeTimeSlotsController() {
  const listFreeTimeSlotsUseCase = makeListFreeTimeSlotsUseCase();

  return new ListFreeTimeSlotsController(listFreeTimeSlotsUseCase);
}
