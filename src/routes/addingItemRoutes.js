import { Router } from 'express';
import { getItems, createItem, updateItem, updateItemFormula, getStockAdjustments } from '../controllers/itemController.js';
import upload from '../config/multerConfig.js';

const router = Router();

router.get('/', getItems);
router.post('/', upload.single('image'), createItem);
router.put('/:id', updateItem);
router.patch('/:id/formula', updateItemFormula);
router.get('/:id/stockreport', getStockAdjustments);

export default router;
