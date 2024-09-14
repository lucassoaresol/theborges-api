import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { VerifyPhoneUseCase } from '../../useCases/auth/verifyPhoneUseCase';

const schema = z.object({
  phone: z.string().min(2),
});

export class VerifyPhoneController implements IController {
  constructor(private readonly verifyPhoneUseCase: VerifyPhoneUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { phone } = schema.parse(body);

    await this.verifyPhoneUseCase.execute({ phone });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
