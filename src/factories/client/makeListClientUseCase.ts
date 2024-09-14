import { ListClientUseCase } from '../../application/useCases/client/ListClientUseCase';

export function makeListClientUseCase() {
  return new ListClientUseCase();
}
