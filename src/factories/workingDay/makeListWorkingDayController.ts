import { ListWorkingDayController } from '../../application/controllers/workingDay/ListWorkingDayController.js';

import { makeListWorkingDayUseCase } from './makeListWorkingDayUseCase.js';

export function makeListWorkingDayController() {
  const listWorkingDayUseCase = makeListWorkingDayUseCase();

  return new ListWorkingDayController(listWorkingDayUseCase);
}
