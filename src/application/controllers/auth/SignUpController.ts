import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { SignUpUseCase } from '../../useCases/auth/SignUpUseCase';

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(2),
  password: z.string().min(2),
  username: z.string().min(2),
});

export class SignUpController implements IController {
  constructor(private readonly signUpUseCase: SignUpUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { name, password, phone, username } = schema.parse(body);

    await this.signUpUseCase.execute({ phone, name, password, username });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
