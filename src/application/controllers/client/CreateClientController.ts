import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { CreateClientUseCase } from '../../useCases/client/CreateClientUseCase';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(2),
  birthDay: z.number().optional(),
  birthMonth: z.number().optional(),
  wantsPromotions: z.boolean().default(true),
});

export class CreateClientController implements IController {
  constructor(private readonly createClientUseCase: CreateClientUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { name, phone, wantsPromotions, birthDay, birthMonth } =
      schema.parse(body);

    const { result } = await this.createClientUseCase.execute({
      birthDay,
      birthMonth,
      name,
      phone,
      wantsPromotions,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
