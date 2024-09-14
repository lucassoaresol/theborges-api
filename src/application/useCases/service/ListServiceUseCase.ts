import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  isAdditional: boolean | undefined;
  categoryId: number | undefined;
  serviceId: number | undefined;
}

interface IOutput {
  result: {
    id: number;
    name: string;
    description: string | null;
    durationMinutes: number;
    price: number;
    color: string;
    categoryId: number;
    isAdditional: boolean;
    additionalPrice: number | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export class ListServiceUseCase {
  async execute({
    categoryId,
    isAdditional,
    serviceId,
  }: IInput): Promise<IOutput> {
    let whereData: any = {};

    if (isAdditional !== undefined) {
      whereData = { ...whereData, isAdditional };
    }

    if (categoryId !== undefined) {
      whereData = { ...whereData, categoryId };
    }

    if (serviceId !== undefined) {
      whereData = { ...whereData, NOT: { id: serviceId } };
    }

    const services = await prismaClient.service.findMany({
      where: whereData,
    });

    return {
      result: services,
    };
  }
}
