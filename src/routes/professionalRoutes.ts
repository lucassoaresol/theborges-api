import { Router } from 'express';

import { makeAuthenticationMiddleware } from '../factories/auth/makeAuthenticationMiddleware';
import { makeCreateProfessionalController } from '../factories/professional/makeCreateProfessionalController';
import { middlewareAdapter } from '../server/adapters/middlewareAdapter';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post(
  '',
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateProfessionalController()),
);

export default router;
