import { OptionalAuthenticationMiddleware } from '../../application/middlewares/OptionalAuthenticationMiddleware';

export function makeOptionalAuthenticationMiddleware() {
  return new OptionalAuthenticationMiddleware();
}
