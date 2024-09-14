import { CreateClientController } from '../../application/controllers/client/CreateClientController.js';

import { makeCreateClientUseCase } from './makeCreateClientUseCase.js';

export function makeCreateClientController() {
  const createClientUseCase = makeCreateClientUseCase();

  return new CreateClientController(createClientUseCase);
}
