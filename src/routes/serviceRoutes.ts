import { Router } from 'express';

import { makeListServiceController } from '../factories/service/makeListServiceController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.get('', routeAdapter(makeListServiceController()));

export default router;
