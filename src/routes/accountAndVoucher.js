import { Router } from 'express';
import { createAccount, getAccounts, createCashVoucher, getCashReport, getCashVouchers, getAccountBalances, getAccountLedger } from '../controllers/accountAndVoucher.js';
const router = Router();

router.get('/', getAccounts).post('/', createAccount)
router.get('/cashreport', getCashReport)
router.post('/cashvoucher', createCashVoucher)
    .get('/cashvoucher', getCashVouchers)
router.get('/balances', getAccountBalances)
router.get('/ledger', getAccountLedger)

export default router