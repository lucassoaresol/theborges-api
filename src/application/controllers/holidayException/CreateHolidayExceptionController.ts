import { z } from 'zod';

import dayLib from '../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { CreateHolidayExceptionUseCase } from '../../useCases/holidayException/CreateHolidayExceptionUseCase';

const schema = z.object({
  date: z.string().refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
    message: 'Formato de data inválido. Use "YYYY-MM-DD".',
  }),
  isClosed: z.boolean().optional().default(false),
  time: z.object({ start: z.number(), end: z.number() }).array().optional(),
});

export class CreateHolidayExceptionController implements IController {
  constructor(
    private readonly createHolidayExceptionUseCase: CreateHolidayExceptionUseCase,
  ) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const { date, isClosed, time } = schema.parse(body);

    await this.createHolidayExceptionUseCase.execute({
      date,
      isClosed,
      time,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
