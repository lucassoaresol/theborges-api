import { verifyNumber } from '../../../libs/axiosWPP';
import { prismaClient } from '../../../libs/prismaClient';
import { PublicIdGenerator } from '../../../utils/PublicIdGenerator';
import { AppError } from '../../errors/appError';

interface IInput {
  name: string;
  phone: string;
  birthDay: number | undefined;
  birthMonth: number | undefined;
  wantsPromotions: boolean;
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
  };
}

export class CreateClientUseCase {
  constructor(private publicIdGenerator: PublicIdGenerator) {}
  async execute({
    birthDay,
    birthMonth,
    name,
    phone,
    wantsPromotions,
  }: IInput): Promise<IOutput> {
    const [resultPhone, publicId] = await Promise.all([
      verifyNumber(phone),
      this.publicIdGenerator.generate('client'),
    ]);

    if (!resultPhone) {
      throw new AppError('');
    }

    const email = resultPhone._serialized;

    const clientAlreadyExists = await prismaClient.client.findUnique({
      where: { email },
    });

    if (clientAlreadyExists) {
      return { result: clientAlreadyExists };
    }

    const client = await prismaClient.client.create({
      data: {
        email,
        name,
        phone,
        publicId,
        birthDay,
        birthMonth,
        wantsPromotions,
      },
    });

    return { result: client };
  }
}
