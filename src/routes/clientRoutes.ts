import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateClientController } from '../factories/client/makeCreateClientController';
import { makeRetrieveClientController } from '../factories/client/makeCreateClientController copy';
import { makeListClientController } from '../factories/client/makeListClientController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('', routeAdapter(makeCreateClientController()));

router.get(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeListClientController()),
);

router.get('/:id', routeAdapter(makeRetrieveClientController()));

export default router;
