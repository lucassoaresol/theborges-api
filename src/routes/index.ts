import { Router } from 'express';

import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import categoryRoutes from './categoryRoutes';
import clientRoutes from './clientRoutes';
import holidayExceptionRoutes from './holidayExceptionRoutes';
import professionalRoutes from './professionalRoutes';
import serviceRoutes from './serviceRoutes';
import workingDayRoutes from './workingDayRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/clients', clientRoutes);
router.use('/holiday-exceptions', holidayExceptionRoutes);
router.use('/professionals', professionalRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/working-days', workingDayRoutes);

export default router;
