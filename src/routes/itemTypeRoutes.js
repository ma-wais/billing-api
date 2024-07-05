import { Router } from 'express';
import { getItemTypes, createItemType } from '../controllers/itemtypeController.js';

const router = Router();

router.get('/', getItemTypes);
router.post('/', createItemType);

export default router;
