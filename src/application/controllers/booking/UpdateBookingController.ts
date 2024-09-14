import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { UpdateBookingUseCase } from '../../useCases/booking/UpdateBookingUseCase';

const schema = z.object({
  status: z.enum(['CANCELLED', 'COMPLETED']).optional(),
  forPersonName: z.string().optional(),
});

export class UpdateBookingController implements IController {
  constructor(private readonly updateBookingUseCase: UpdateBookingUseCase) {}

  async handle({ body, params }: IRequest): Promise<IResponse> {
    const { status, forPersonName } = schema.parse(body);

    await this.updateBookingUseCase.execute({
      bookingId: Number(params.id),
      forPersonName,
      status,
    });

    return {
      statusCode: 204,
      body: null,
    };
  }
}
