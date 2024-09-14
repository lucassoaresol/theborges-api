import { Router } from 'express';

import { makeCreateBookingController } from '../factories/booking/makeCreateBookingController';
import { makeUpdateBookingController } from '../factories/booking/makeUpdateBookingController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.post('', routeAdapter(makeCreateBookingController()));
router.patch('/:id', routeAdapter(makeUpdateBookingController()));

export default router;
