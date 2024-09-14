import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  accountId: number;
  imageUrl: string;
}

type IOutput = void;

export class CreateProfessionalUseCase {
  async execute({ accountId, imageUrl }: IInput): Promise<IOutput> {
    await prismaClient.professional.create({ data: { accountId, imageUrl } });
  }
}
