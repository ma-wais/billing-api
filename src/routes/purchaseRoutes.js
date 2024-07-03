import { Router } from 'express';
import { getPurchaseReturns, createPurchaseReturn, getPurchaseAdds, createPurchaseAdd, getPurchaseLooseAdd, createPurchaseLooseAdd,
    getSales, createSales, getSaleReturn, createSaleReturn, deleteSale
 } from '../controllers/purchaseController.js';

const router = Router();

router.get('/', getPurchaseAdds).post('/', createPurchaseAdd)

router.get('/loose', getPurchaseLooseAdd).post('/loose', createPurchaseLooseAdd)

router.get('/return', getPurchaseReturns).post('/return', createPurchaseReturn)

router.get('/sales', getSales).post('/sales', createSales)

router.get('/sale/return', getSaleReturn).post('/sale/return', createSaleReturn)
    .delete('/sale/:invoiceref', deleteSale)

export default router;
