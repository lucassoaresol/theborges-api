import jwt from 'jsonwebtoken';

import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  refreshTokenId: string;
}

interface IOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly jwtSecret: string,
    private readonly expTimeInDays: number,
  ) {}

  async execute({ refreshTokenId }: IInput): Promise<IOutput> {
    const refreshToken = await prismaClient.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });

    if (!refreshToken) {
      throw new AppError('');
    }

    if (Date.now() > refreshToken.expiresAt.getTime()) {
      await prismaClient.refreshToken.delete({ where: { id: refreshTokenId } });

      throw new AppError('');
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.expTimeInDays);

    const accessToken = jwt.sign(
      { sub: refreshToken.accountId },
      this.jwtSecret,
      {
        expiresIn: '1d',
      },
    );

    const [newRefreshToken] = await Promise.all([
      prismaClient.refreshToken.create({
        data: { accountId: refreshToken.accountId, expiresAt },
      }),
      prismaClient.refreshToken.delete({ where: { id: refreshTokenId } }),
    ]);

    return {
      accessToken,
      refreshToken: newRefreshToken.id,
    };
  }
}
