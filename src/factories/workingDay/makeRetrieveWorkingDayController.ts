import { RetrieveWorkingDayController } from '../../application/controllers/workingDay/RetrieveWorkingDayController.js';

import { makeRetrieveWorkingDayUseCase } from './makeRetrieveWorkingDayUseCase.js';

export function makeRetrieveWorkingDayController() {
  const retrieveWorkingDayUseCase = makeRetrieveWorkingDayUseCase();

  return new RetrieveWorkingDayController(retrieveWorkingDayUseCase);
}
