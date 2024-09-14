import { RefreshTokenController } from '../../application/controllers/auth/RefreshTokenController.js';

import { makeRefreshTokenUseCase } from './makeRefreshTokenUseCase.js';

export function makeRefreshTokenController() {
  const refreshTokenUseCase = makeRefreshTokenUseCase();

  return new RefreshTokenController(refreshTokenUseCase);
}
