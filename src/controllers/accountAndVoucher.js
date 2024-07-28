import Account from "../models/Account.js";
import CashVoucher from "../models/Voucher.js";

export const createAccount = async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('city');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAccount = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).populate('city');
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
};

export const updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createCashVoucher = async (req, res) => {
    try {
        const { date, account, amount, description, type } = req.body;
        
        const accountDoc = await Account.findById(account);
        if (!accountDoc) {
            return res.status(404).json({ message: "Account not found" });
        }

        const newCashVoucher = new CashVoucher({
            date,
            account,
            type,
            amount,
            description
        });

        const savedCashVoucher = await newCashVoucher.save();

        if (type === "CashPayment") {
            await accountDoc.updateBalance(amount);
        } else if (type === "CashReceipt") {
            await accountDoc.updateBalance(-amount);
        }

        res.status(201).json(savedCashVoucher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCashVouchers = async (req, res) => {
  const { dateFrom, dateTo, type, account } = req.query;

  let query = {};

  if (dateFrom) {
    query.date = {
      $gte: new Date(dateFrom),
    };
  }

  if (dateTo) {
    query.date = {
      ...query.date,
      $lte: new Date(dateTo),
    };
  }

  if (type) {
    query.type = type;
  }

  try {
    let cashVouchers = (await CashVoucher.find(query).populate('account', 'accountName'))
  
    if (account) {
      cashVouchers = cashVouchers.filter((voucher) => voucher.account.accountName.toLowerCase() === account.toLowerCase());
    }

    res.status(200).json(cashVouchers);
  } catch (error) {
    console.error('Error in getCashVouchers:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCashVoucher = async (req, res) => {
    try {
        const cashVoucher = await CashVoucher.findById(req.params.id).populate('account', 'accountName balance');
        res.status(200).json(cashVoucher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteCashVoucher = async (req, res) => {
    try {
        const deletedCashVoucher = await CashVoucher.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedCashVoucher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateCashVoucher = async (req, res) => {
    try {
        const updatedCashVoucher = await CashVoucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedCashVoucher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const getCashReport = async (req, res) => {
    const { dateFrom, dateTo, account, type } = req.query;

    try {
        const query = {
            date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) }
        };

        if (account) {
            query.account = account;
        }

        if (type && type !== 'all') {
            query.type = type === 'cash' ? 'CashPayment' : 'CashReceipt';
        }

        const cashVouchers = await CashVoucher.find(query).populate('account');

        const report = cashVouchers.map((voucher, index) => ({
            sr: index + 1,
            date: voucher.date.toISOString().split('T')[0],
            accountTitle: voucher.account.accountName,
            description: voucher.description,
            type: voucher.type === 'CashPayment' ? 'P' : 'R',
            amount: voucher.amount
        }));

        const total = report.reduce((sum, item) => sum + item.amount, 0);

        res.status(200).json({ report, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAccountBalances = async (req, res) => {
    try {
      const { showReceivable, showPayable, showExpenses, showTrading } = req.query;
      const accounts = await Account.find();
      const cashVouchers = await CashVoucher.find().populate('account');
  
      const balances = {
        receivable: { accounts: [], total: 0 },
        payable: { accounts: [], total: 0 },
        expenses: { accounts: [], total: 0 },
        trading: { accounts: [], total: 0 }
      };
  
      accounts.forEach(account => {
        const openingDebit = account.openingDebit;
        const closingCredit = account.closingCredit;
  
        const totalPayments = cashVouchers
          .filter(voucher => voucher.account._id.toString() === account._id.toString() && voucher.type === 'CashPayment')
          .reduce((sum, voucher) => sum + voucher.amount, 0);
  
        const totalReceipts = cashVouchers
          .filter(voucher => voucher.account._id.toString() === account._id.toString() && voucher.type === 'CashReceipt')
          .reduce((sum, voucher) => sum + voucher.amount, 0);
  
        const balance = openingDebit - closingCredit + totalReceipts - totalPayments;
  
        if (balance > 0 && showReceivable === 'true') {
          balances.receivable.accounts.push({ accountName: account.accountName, balance });
          balances.receivable.total += balance;
        } else if (balance < 0 && showPayable === 'true') {
          balances.payable.accounts.push({ accountName: account.accountName, balance: Math.abs(balance) });
          balances.payable.total += Math.abs(balance);
        } else if (account.accountType === 'Expenses' && showExpenses === 'true') {
          balances.expenses.accounts.push({ accountName: account.accountName, balance });
          balances.expenses.total += balance;
        } else if (account.accountType === 'Trading' && showTrading === 'true') {
          balances.trading.accounts.push({ accountName: account.accountName, balance });
          balances.trading.total += balance;
        }
      });
  
      res.status(200).json(balances);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
export const getAccountLedger = async (req, res) => {
    try {
      const { accountId, dateFrom, dateTo } = req.query;
  
      if (!accountId || !dateFrom || !dateTo) {
        return res.status(400).json({ message: "Missing required query parameters" });
      }
  
      // Fetch the account details
      const account = await Account.findById(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
  
      // Fetch the cash vouchers for the account within the date range
      const cashVouchers = await CashVoucher.find({
        account: accountId,
        date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) }
      }).sort('date');
  
      // Calculate the opening balance
      let openingBalance = account.openingDebit - account.closingCredit;
  
      // Prepare the ledger entries
      const ledgerEntries = cashVouchers.map((voucher, index) => {
        const isDebit = voucher.type === 'CashPayment';
        const amount = voucher.amount;
        const balance = isDebit ? (openingBalance -= amount) : (openingBalance += amount);
  
        return {
          sr: index + 1,
          date: voucher.date.toISOString().split('T')[0],
          type: isDebit ? 'Debit' : 'Credit',
          narration: voucher.description,
          debit: isDebit ? amount : 0,
          credit: isDebit ? 0 : amount,
          balance: balance
        };
      });
  
      // Calculate the closing balance
      const closingBalance = openingBalance;
  
      // Prepare the response
      const response = {
        accountTitle: account.accountName,
        dateFrom,
        dateTo,
        openingBalance: account.openingDebit - account.closingCredit,
        transactions: ledgerEntries,
        closingBalance
      };
  
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };