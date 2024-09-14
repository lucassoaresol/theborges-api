import { z } from 'zod';

import dayLib from '../../../libs/dayjs';
import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { CreateBookingUseCase } from '../../useCases/booking/CreateBookingUseCase';

const schema = z.object({
  date: z.string().refine((val) => dayLib(val, 'YYYY-MM-DD', true).isValid(), {
    message: 'Formato de data inválido. Use "YYYY-MM-DD".',
  }),
  startTime: z.number(),
  endTime: z.number(),
  forPersonName: z.string().optional(),
  clientId: z.number().positive(),
  professionalId: z.number().positive(),
  services: z
    .object({
      price: z.number(),
      serviceId: z.number().positive(),
      order: z.number().positive(),
    })
    .array(),
});

export class CreateBookingController implements IController {
  constructor(private readonly createBookingUseCase: CreateBookingUseCase) {}

  async handle({ body }: IRequest): Promise<IResponse> {
    const {
      clientId,
      date,
      endTime,
      professionalId,
      services,
      startTime,
      forPersonName,
    } = schema.parse(body);

    await this.createBookingUseCase.execute({
      clientId,
      date,
      endTime,
      forPersonName,
      professionalId,
      services,
      startTime,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
