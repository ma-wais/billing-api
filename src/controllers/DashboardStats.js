import {Sale, SaleReturn} from '../models/Sales.js';
import PurchaseAdd, {PurchaseReturn} from '../models/purchaseModels.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      todayNetSales,
      last7DaysNetSales,
      currentMonthSales,
      currentYearSales,
      todaySaleReturn,
      last7DaysSaleReturn,
      currentMonthSaleReturn,
      currentYearSaleReturn,
      todayPurchase,
      last7DaysPurchase,
      currentMonthPurchase,
      currentYearPurchase,
      todayPurchaseReturn,
      last7DaysPurchaseReturn,
      currentMonthPurchaseReturn,
      currentYearPurchaseReturn
    ] = await Promise.all([
      getNetSales(today, new Date()),
      getNetSales(sevenDaysAgo, new Date()),
      getNetSales(firstDayOfMonth, new Date()),
      getNetSales(firstDayOfYear, new Date()),
      getSaleReturns(today, new Date()),
      getSaleReturns(sevenDaysAgo, new Date()),
      getSaleReturns(firstDayOfMonth, new Date()),
      getSaleReturns(firstDayOfYear, new Date()),
      getPurchases(today, new Date()),
      getPurchases(sevenDaysAgo, new Date()),
      getPurchases(firstDayOfMonth, new Date()),
      getPurchases(firstDayOfYear, new Date()),
      getPurchaseReturns(today, new Date()),
      getPurchaseReturns(sevenDaysAgo, new Date()),
      getPurchaseReturns(firstDayOfMonth, new Date()),
      getPurchaseReturns(firstDayOfYear, new Date())
    ]);

    res.json({
      todayNetSales,
      last7DaysNetSales,
      currentMonthSales,
      currentYearSales,
      todaySaleReturn,
      last7DaysSaleReturn,
      currentMonthSaleReturn,
      currentYearSaleReturn,
      todayPurchase,
      last7DaysPurchase,
      currentMonthPurchase,
      currentYearPurchase,
      todayPurchaseReturn,
      last7DaysPurchaseReturn,
      currentMonthPurchaseReturn,
      currentYearPurchaseReturn
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNetSales = async (startDate, endDate) => {
  const result = await Sale.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalNetSales: { $sum: "$netPrice" }
      }
    }
  ]);
  return result.length > 0 ? result[0].totalNetSales : 0;
};

const getSaleReturns = async (startDate, endDate) => {
  const result = await SaleReturn.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSaleReturns: { $sum: "$netPrice" }
      }
    }
  ]);
  return result.length > 0 ? result[0].totalSaleReturns : 0;
};

const getPurchases = async (startDate, endDate) => {
  const result = await PurchaseAdd.aggregate([
    {
      $match: {
        dateOfPurchase: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: "$netAmount" }
      }
    }
  ]);
  return result.length > 0 ? result[0].totalPurchases : 0;
};

const getPurchaseReturns = async (startDate, endDate) => {
  const result = await PurchaseReturn.aggregate([
    {
      $match: {
        dateOfPurchase: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalPurchaseReturns: { $sum: "$netAmount" }
      }
    }
  ]);
  return result.length > 0 ? result[0].totalPurchaseReturns : 0;
};