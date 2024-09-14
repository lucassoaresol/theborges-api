import { prismaClient } from '../../../libs/prismaClient';

interface IInput {
  search: string | undefined;
  wantsPromotions: boolean | undefined;
  take: number | undefined;
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
  }[];
}

export class ListClientUseCase {
  async execute({ search, wantsPromotions, take }: IInput): Promise<IOutput> {
    const filterConditions = this.buildFilterConditions(
      search,
      wantsPromotions,
    );

    const clients = await prismaClient.client.findMany({
      where: filterConditions,
      orderBy: { name: 'asc' },
      take,
    });

    return {
      result: clients,
    };
  }

  private buildFilterConditions(search?: string, wantsPromotions?: boolean) {
    const filterConditions: any = {};
    if (search) {
      filterConditions.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (wantsPromotions !== undefined) {
      filterConditions.wantsPromotions = wantsPromotions;
    }

    return filterConditions;
  }
}
