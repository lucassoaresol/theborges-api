import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateHolidayExceptionController } from '../factories/holidayException/makeCreateHolidayExceptionController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateHolidayExceptionController()),
);

export default router;
