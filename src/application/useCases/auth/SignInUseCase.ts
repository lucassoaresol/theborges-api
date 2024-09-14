import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  username: string;
  password: string;
}

interface IOutput {
  accessToken: string;
  refreshToken: string;
}

export class SignInUseCase {
  constructor(
    private readonly jwtSecret: string,
    private readonly expTimeInDays: number,
  ) {}

  async execute({ username, password }: IInput): Promise<IOutput> {
    const account = await prismaClient.account.findUnique({
      where: { username },
    });

    if (!account) {
      throw new AppError('');
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);

    if (!isPasswordValid) {
      throw new AppError('');
    }

    const accessToken = jwt.sign({ sub: account.id }, this.jwtSecret, {
      expiresIn: '1d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.expTimeInDays);

    const { id } = await prismaClient.refreshToken.create({
      data: {
        accountId: account.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: id,
    };
  }
}
