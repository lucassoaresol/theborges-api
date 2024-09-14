import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { RetrieveWorkingDayUseCase } from '../../useCases/workingDay/RetrieveWorkingDayUseCase';

export class RetrieveWorkingDayController implements IController {
  constructor(
    private readonly retrieveWorkingDayUseCase: RetrieveWorkingDayUseCase,
  ) {}

  async handle({ params }: IRequest): Promise<IResponse> {
    const { result } = await this.retrieveWorkingDayUseCase.execute({
      key: Number(params.id),
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
