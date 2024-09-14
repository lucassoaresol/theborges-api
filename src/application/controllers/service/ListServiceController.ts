import { z } from 'zod';

import { IController, IRequest, IResponse } from '../../interfaces/IController';
import { ListServiceUseCase } from '../../useCases/service/ListServiceUseCase';

const schema = z.object({
  isAdditional: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined; // Se não for 'true' ou 'false', considerar undefined
    }),
  categoryId: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10); // Se val for undefined ou string vazia, retorna NaN
      return isNaN(parsed) ? undefined : parsed; // Converte para número ou retorna undefined
    }),
  serviceId: z
    .string()
    .optional()
    .transform((val) => {
      const parsed = parseInt(val ?? '', 10); // Se val for undefined ou string vazia, retorna NaN
      return isNaN(parsed) ? undefined : parsed; // Converte para número ou retorna undefined
    }),
});

export class ListServiceController implements IController {
  constructor(private readonly listServiceUseCase: ListServiceUseCase) {}

  async handle({ query }: IRequest): Promise<IResponse> {
    const safeQuery = query || {};

    const { categoryId, isAdditional, serviceId } = schema.parse(safeQuery);

    const { result } = await this.listServiceUseCase.execute({
      categoryId,
      isAdditional,
      serviceId,
    });

    return {
      statusCode: 200,
      body: {
        result,
      },
    };
  }
}
