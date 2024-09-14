import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeOptionalAuthenticationMiddleware } from '../factories/auth/makeOptionalAuthenticationMiddleware';
import { makeListFreeTimeSlotsController } from '../factories/workingDay/makeListFreeTimeSlotsController';
import { makeListWorkingDayController } from '../factories/workingDay/makeListWorkingDayController';
import { makeRetrieveWorkingDayController } from '../factories/workingDay/makeRetrieveWorkingDayController';
import { makeUpdateWorkingDayController } from '../factories/workingDay/makeUpdateWorkingDayController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post(
  '/free-time',
  middlewareAdapter(makeOptionalAuthenticationMiddleware()),
  routeAdapter(makeListFreeTimeSlotsController()),
);

router.get(
  '',
  middlewareAdapter(makeOptionalAuthenticationMiddleware()),
  routeAdapter(makeListWorkingDayController()),
);

router.get(
  '/:id',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeRetrieveWorkingDayController()),
);

router.patch(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateWorkingDayController()),
);

export default router;
