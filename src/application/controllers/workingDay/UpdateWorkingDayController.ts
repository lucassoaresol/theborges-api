import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateWorkingDayUseCase } from '../../useCases/workingDay/UpdateWorkingDayUseCase';

const schema = z.object({
  professionalId: z.number().positive(),
  start: z.number().positive(),
  end: z.number().positive(),
});

export class UpdateWorkingDayController implements IController {
  constructor(
    private readonly updateWorkingDayUseCase: UpdateWorkingDayUseCase,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { end, professionalId, start } = schema.parse(body);

    await this.updateWorkingDayUseCase.execute({
      end,
      professionalId,
      start,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
