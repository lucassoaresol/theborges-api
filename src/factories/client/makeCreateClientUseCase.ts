import { CreateClientUseCase } from '../../application/useCases/client/CreateClientUseCase';
import { PublicIdGenerator } from '../../utils/PublicIdGenerator';

export function makeCreateClientUseCase() {
  const publicIdGenerator = new PublicIdGenerator();

  return new CreateClientUseCase(publicIdGenerator);
}
