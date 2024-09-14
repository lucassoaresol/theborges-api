import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { RetrieveClientUseCase } from '../../useCases/client/RetrieveClientUseCase';

export class RetrieveClientController implements IController {
  constructor(private readonly retrieveClientUseCase: RetrieveClientUseCase) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.retrieveClientUseCase.execute({
      key: params.id,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
