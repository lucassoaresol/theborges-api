import { RetrieveClientController } from '../../application/controllers/client/RetrieveClientController.js';

import { makeRetrieveClientUseCase } from './makeRetrieveClientUseCase.js';

export function makeRetrieveClientController() {
  const retrieveClientUseCase = makeRetrieveClientUseCase();

  return new RetrieveClientController(retrieveClientUseCase);
}
