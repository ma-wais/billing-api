import { Router } from 'express';
import { getItemTypes, createItemType } from '../controllers/itemTypeController.js';

const router = Router();

router.get('/', getItemTypes);
router.post('/', createItemType);

export default router;
