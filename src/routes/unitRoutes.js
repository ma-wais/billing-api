import { Router } from 'express';
import { getUnits, createUnit } from '../controllers/unitController.js';

const router = Router();

router.get('/', getUnits);
router.post('/', createUnit);

export default router;
