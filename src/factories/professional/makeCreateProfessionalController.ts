import { CreateProfessionalController } from '../../application/controllers/professional/CreateProfessionalController.js';

import { makeCreateProfessionalUseCase } from './makeCreateProfessionalUseCase.js';

export function makeCreateProfessionalController() {
  const createProfessionalUseCase = makeCreateProfessionalUseCase();

  return new CreateProfessionalController(createProfessionalUseCase);
}
