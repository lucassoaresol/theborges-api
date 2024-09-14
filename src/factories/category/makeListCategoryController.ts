import { ListCategoryController } from '../../application/controllers/category/ListCategoryController.js';

import { makeListCategoryUseCase } from './makeListCategoryUseCase.js';

export function makeListCategoryController() {
  const listCategoryUseCase = makeListCategoryUseCase();

  return new ListCategoryController(listCategoryUseCase);
}
