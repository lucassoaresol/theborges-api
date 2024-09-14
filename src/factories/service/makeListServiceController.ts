import { ListServiceController } from '../../application/controllers/service/ListServiceController.js';

import { makeListServiceUseCase } from './makeListServiceUseCase.js';

export function makeListServiceController() {
  const listServiceUseCase = makeListServiceUseCase();

  return new ListServiceController(listServiceUseCase);
}
