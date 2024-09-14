import bcrypt from 'bcryptjs';

import { verifyNumber } from '../../../libs/axiosWPP';
import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  name: string;
  phone: string;
  username: string;
  password: string;
}

type IOutput = void;

export class SignUpUseCase {
  constructor(private readonly salt: number) {}

  async execute({ phone, name, password, username }: IInput): Promise<IOutput> {
    const resultPhone = await verifyNumber(phone);

    if (!resultPhone) {
      throw new AppError('');
    }

    const email = resultPhone._serialized;

    const accountAlreadyExists = await prismaClient.account.findUnique({
      where: { username },
    });

    if (accountAlreadyExists) {
      throw new AppError('');
    }

    const hashedPassword = await bcrypt.hash(password, this.salt);

    await prismaClient.account.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
      },
    });
  }
}
