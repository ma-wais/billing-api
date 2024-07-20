import { Router } from 'express';
import { getUnits, createUnit, updateUnit, getUnit } from '../controllers/unitController.js';

const router = Router();

router.get('/', getUnits).post('/', createUnit);
router.get('/:id', getUnit).put('/:id', updateUnit);

export default router;
