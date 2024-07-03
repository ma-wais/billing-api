import { Router } from 'express';
import { getItemMapSuppliers, createItemMapSupplier, updateMaxQuantityBySupplier } from '../controllers/itemMapSupplierController.js';

const router = Router();

router.get('/', getItemMapSuppliers);
router.post('/', createItemMapSupplier);
router.patch('/update-max-quantity', updateMaxQuantityBySupplier);

export default router;
