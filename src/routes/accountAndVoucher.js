import { Router } from 'express';
import {
    createAccount, getAccounts, getAccount, updateAccount, createCashVoucher, 
    updateCashVoucher, deleteCashVoucher, getCashReport,
    getCashVouchers, getAccountBalances, getAccountLedger
} from '../controllers/accountAndVoucher.js';
const router = Router();

router.get('/', getAccounts).post('/', createAccount)
router.get('/cashvoucher', getCashVouchers).post('/cashvoucher', createCashVoucher)
router.put('/cashvoucher/:id', updateCashVoucher).delete('/cashvoucher/:id', deleteCashVoucher)
router.get('/balances', getAccountBalances)
router.get('/cashreport', getCashReport)
router.get('/ledger', getAccountLedger)
router.get('/:id', getAccount).put('/:id', updateAccount)

export default router