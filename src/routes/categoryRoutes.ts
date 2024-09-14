import { Router } from 'express';

import { makeListCategoryController } from '../factories/category/makeListCategoryController';
import { routeAdapter } from '../server/adapters/routeAdapter';

const router = Router();

router.get('', routeAdapter(makeListCategoryController()));

export default router;
