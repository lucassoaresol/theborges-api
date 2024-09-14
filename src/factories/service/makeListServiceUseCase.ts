import { ListServiceUseCase } from '../../application/useCases/service/ListServiceUseCase';

export function makeListServiceUseCase() {
  return new ListServiceUseCase();
}
