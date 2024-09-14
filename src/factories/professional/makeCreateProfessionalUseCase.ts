import { CreateProfessionalUseCase } from '../../application/useCases/professional/CreateProfessionalUseCase';

export function makeCreateProfessionalUseCase() {
  return new CreateProfessionalUseCase();
}
