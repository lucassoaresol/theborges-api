import { prismaClient } from '../../../libs/prismaClient';
import { AppError } from '../../errors/appError';

interface IInput {
  key: string;
}

interface IOutput {
  result: {
    id: number;
    name: string;
    phone: string;
    email: string;
    birthDay: number | null;
    birthMonth: number | null;
    wantsPromotions: boolean;
    publicId: string;
    createdAt: Date;
    updatedAt: Date;
    bookingCart: {
      id: number;
      selectedDate: Date | null;
      startTime: number | null;
      endTime: number | null;
      professionalId: number | null;
      clientId: number;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
}

export class RetrieveClientUseCase {
  async execute({ key }: IInput): Promise<IOutput> {
    const filterConditions: any = {};

    if (parseInt(key)) {
      filterConditions.id = parseInt(key);
    } else {
      filterConditions.publicId = key;
    }

    const client = await prismaClient.client.findFirst({
      where: filterConditions,
      include: { bookingCart: true },
    });

    if (!client) {
      throw new AppError('');
    }

    return {
      result: client,
    };
  }
}
