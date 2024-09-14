import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { RefreshTokenUseCase } from '../../useCases/auth/RefreshTokenUseCase';

const schema = z.object({
  refreshToken: z.string().uuid(),
});

export class RefreshTokenController implements IController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { refreshToken: refreshTokenId } = schema.parse(body);

    const { accessToken, refreshToken } =
      await this.refreshTokenUseCase.execute({
        refreshTokenId,
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
