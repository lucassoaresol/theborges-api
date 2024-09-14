import { ListCategoryUseCase } from '../../application/useCases/category/ListCategoryUseCase';

export function makeListCategoryUseCase() {
  return new ListCategoryUseCase();
}
