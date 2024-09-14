import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { CreateProfessionalUseCase } from '../../useCases/professional/CreateProfessionalUseCase';

const schema = z.object({
  accountId: z.number().positive(),
  imageUrl: z.string().url(),
});

export class CreateProfessionalController implements IController {
  constructor(
    private readonly createProfessionalUseCase: CreateProfessionalUseCase,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { accountId, imageUrl } = schema.parse(body);

    await this.createProfessionalUseCase.execute({
      accountId,
      imageUrl,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
