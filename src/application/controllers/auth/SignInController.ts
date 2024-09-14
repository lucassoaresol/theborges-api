import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { SignInUseCase } from '../../useCases/auth/SignInUseCase';

const schema = z.object({
  username: z.string().min(2),
  password: z.string().min(2),
});

export class SignInController implements IController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { username, password } = schema.parse(body);

    const { accessToken, refreshToken } = await this.signInUseCase.execute({
      username,
      password,
    });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}
