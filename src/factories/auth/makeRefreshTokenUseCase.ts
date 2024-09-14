import { EXP_TIME_IN_DAYS } from '../../application/config/constants';
import { env } from '../../application/config/env';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';

export function makeRefreshTokenUseCase() {
  return new RefreshTokenUseCase(env.jwtSecret, EXP_TIME_IN_DAYS);
}
