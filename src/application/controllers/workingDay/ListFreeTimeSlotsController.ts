import { z } from 'zod';

import dayLib from '../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { ListFreeTimeSlotsUseCase } from '../../useCases/workingDay/ListFreeTimeSlotsUseCase';

const schema = z.object({
  requiredMinutes: z.number(),
  date: z.string().refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
    message: 'Formato de data inválido. Use "YYYY-MM-DD".',
  }),
  professionalId: z.number().positive(),
  isIgnoreBreak: z.boolean().default(false),
});

export class ListFreeTimeSlotsController implements IController {
  constructor(
    private readonly listFreeTimeSlotsUseCase: ListFreeTimeSlotsUseCase,
  ) {}

  async handle({ body, accountId }: IRequest): Promise<IResponse> {
    const { date, requiredMinutes, professionalId, isIgnoreBreak } =
      schema.parse(body);

    const { result } = await this.listFreeTimeSlotsUseCase.execute({
      date,
      requiredMinutes,
      professionalId,
      isAuthenticated: !!accountId,
      isIgnoreBreak,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}
