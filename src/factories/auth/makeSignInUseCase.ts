import { EXP_TIME_IN_DAYS } from '../../application/config/constants';
import { env } from '../../application/config/env';
import { SignInUseCase } from '../../application/useCases/auth/SignInUseCase';

export function makeSignInUseCase() {
  return new SignInUseCase(env.jwtSecret, EXP_TIME_IN_DAYS);
}
