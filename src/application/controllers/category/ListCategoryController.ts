import { IController, IResponse } from '../../interfaces/IController';
import { ListCategoryUseCase } from '../../useCases/category/ListCategoryUseCase';

export class ListCategoryController implements IController {
  constructor(private readonly listCategoryUseCase: ListCategoryUseCase) {}

  async handle(): Promise<IResponse> {
    const { result } = await this.listCategoryUseCase.execute();

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
