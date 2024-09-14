import { VerifyPhoneUseCase } from '../../application/useCases/auth/verifyPhoneUseCase';

export function makeVerifyPhoneUseCase() {
  return new VerifyPhoneUseCase();
}
