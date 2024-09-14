import { RetrieveClientUseCase } from '../../application/useCases/client/RetrieveClientUseCase';

export function makeRetrieveClientUseCase() {
  return new RetrieveClientUseCase();
}
