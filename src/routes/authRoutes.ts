import { Router } from 'express';

import { makeRefreshTokenController } from '../factories/auth/makeRefreshTokenController';
import { makeSignInController } from '../factories/auth/makeSignInController';
import { makeSignUpController } from '../factories/auth/makeSignUpController';
import { makeVerifyPhoneController } from '../factories/auth/makeVerifyPhoneController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('/sign-in', routeAdapter(makeSignInController()));
router.post('/sign-up', routeAdapter(makeSignUpController()));
router.post('/refresh-token', routeAdapter(makeRefreshTokenController()));
router.post('/phone', routeAdapter(makeVerifyPhoneController()));

export default router;
