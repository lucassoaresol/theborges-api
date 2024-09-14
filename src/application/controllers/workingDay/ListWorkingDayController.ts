import { z } from 'zod';

import dayLib from '../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { ListWorkingDayUseCase } from '../../useCases/workingDay/ListWorkingDayUseCase';

const schema = z.object({
  date: z
    .string()
    .optional()
    .refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Formato de data inválido. Use "YYYY-MM-DD".',
    }),
  professionalId: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10);
      return isNaN(parsed) ? undefined : parsed;
    }),
});

export class ListWorkingDayController implements IController {
  constructor(private readonly listWorkingDayUseCase: ListWorkingDayUseCase) {}

  async handle({ query, accountId }: IRequest): Promise<IResponse> {
    const safeQuery = query || {};

    const { date, professionalId } = schema.parse(safeQuery);

    const { result } = await this.listWorkingDayUseCase.execute({
      date,
      professionalId,
      isAuth: !!accountId,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
