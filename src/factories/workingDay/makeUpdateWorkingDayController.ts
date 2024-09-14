import { UpdateWorkingDayController } from '../../application/controllers/workingDay/UpdateWorkingDayController.js';

import { makeUpdateWorkingDayUseCase } from './makeUpdateWorkingDayUseCase.js';

export function makeUpdateWorkingDayController() {
  const updateWorkingDayUseCase = makeUpdateWorkingDayUseCase();

  return new UpdateWorkingDayController(updateWorkingDayUseCase);
}
