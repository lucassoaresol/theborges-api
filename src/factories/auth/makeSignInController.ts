import { SignInController } from '../../application/controllers/auth/SignInController.js';

import { makeSignInUseCase } from './makeSignInUseCase.js';

export function makeSignInController() {
  const signInUseCase = makeSignInUseCase();

  return new SignInController(signInUseCase);
}
