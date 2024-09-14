import { ListClientController } from '../../application/controllers/client/ListClientController.js';

import { makeListClientUseCase } from './makeListClientUseCase.js';

export function makeListClientController() {
  const listClientUseCase = makeListClientUseCase();

  return new ListClientController(listClientUseCase);
}
