import { VerifyPhoneController } from '../../application/controllers/auth/VerifyPhoneController.js';

import { makeVerifyPhoneUseCase } from './makeVerifyPhoneUseCase.js';

export function makeVerifyPhoneController() {
  const verifyPhoneUseCase = makeVerifyPhoneUseCase();

  return new VerifyPhoneController(verifyPhoneUseCase);
}
