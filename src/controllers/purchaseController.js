import PurchaseAdd, { PurchaseAddLoose, PurchaseReturn } from '../models/purchaseModels.js';
import AddingItem from '../models/Item.js';
import { Sale, SaleReturn } from '../models/Sales.js';

export const getPurchaseLooseAdd = async (req, res) => {
  try {
    const purchaseAdds = await PurchaseAddLoose.find();
    res.json(purchaseAdds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseReturns = async (req, res) => {
  try {
    const purchaseReturns = await PurchaseReturn.find();
    res.json(purchaseReturns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseAdds = async (req, res) => {
  try {
    const { item, startDate, endDate, supplier, daysToExpire } = req.query;

    let query = {};
    if (item) {
      query['purchases.item'] = item;
    }
    if (startDate && endDate) {
      query.dateOfPurchase = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (supplier) {
      query.supplier = supplier;
    }
    if (daysToExpire) {
      const today = new Date();
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + parseInt(daysToExpire));

      query['purchases.expiryDate'] = {
        $gte: today,
        $lte: targetDate
      };
    }

    const purchaseAdds = await PurchaseAdd.find(query);
    res.json(purchaseAdds);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseLooseAdd = async (req, res) => {
  const {
    supplier, dateOfPurchase, billNumber, paymentMode, remarks, looseItems
  } = req.body;

  try {
    const newPurchaseAddLoose = new PurchaseAddLoose({
      supplier, dateOfPurchase, billNumber, paymentMode, remarks, looseItems
    });

    const savedPurchaseAdd = await newPurchaseAddLoose.save();

    // Update stock for each loose item
    for (const item of looseItems) {
      const addingItem = await AddingItem.findOne({ itemName: item.item });
      if (!addingItem) {
        throw new Error(`Item with name ${item.item} not found`);
      }
      await addingItem.updateStock(item.looseQuantity);
    }

    res.status(201).json(savedPurchaseAdd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSales = async (req, res) => {
  try {
    const { from, to, invoiceref, customername, customerphone } = req.query;

    let query = {};

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to)
      };
    }

    if (invoiceref) {
      query.invoiceRef = invoiceref;
    }

    if (customername) {
      query.customerName = customername;
    }

    if (customerphone) {
      query.customerPhone = customerphone;
    }

    const sales = await Sale.find(query);
    const totals = sales.reduce((acc, sale) => {
      acc.totalSoldQty += sale.items.reduce((sum, item) => sum + item.quantity, 0);
      acc.totalCost += sale.totalCost;
      acc.totalSaleValue += sale.totalAmount;
      acc.totalDiscount += sale.discountPrice;
      acc.totalNetAmount += sale.netPrice;
      acc.totalProfit += sale.totalProfit;
      return acc;
    }, {
      totalSoldQty: 0,
      totalCost: 0,
      totalSaleValue: 0,
      totalDiscount: 0,
      totalNetAmount: 0,
      totalProfit: 0
    });

    res.json({ sales, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPurchaseAdd = async (req, res) => {
  const { supplier, dateOfPurchase, billNumber, paymentMode, remarks, purchases, totalItems, billAmount, discountPercentage, discountAmount, advanceTaxAmount, netAmount } = req.body;

  try {
    const newPurchaseAdd = new PurchaseAdd({
      supplier,
      dateOfPurchase,
      billNumber,
      paymentMode,
      remarks,
      purchases,
      totalItems,
      billAmount,
      discountPercentage,
      discountAmount,
      advanceTaxAmount,
      netAmount
    });

    const savedPurchaseAdd = await newPurchaseAdd.save();

    for (const purchase of purchases) {
      const addingItem = await AddingItem.findOne({ itemName: purchase.item });
      if (!addingItem) {
        throw new Error(`Item not found: ${purchase.item}`);
      }
      await addingItem.updateStock(purchase.quantity);
    }

    res.status(201).json(savedPurchaseAdd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createPurchaseReturn = async (req, res) => {
  const { supplier, dateOfPurchase, billNumber, paymentMode, purchases, totalItems, billAmount,
    discountPercentage, discountAmount, advanceTaxAmount, netAmount } = req.body;


  try {
    const newPurchaseReturn = new PurchaseReturn({
      supplier,
      dateOfPurchase,
      billNumber,
      paymentMode,
      purchases,
      totalItems,
      billAmount,
      discountPercentage,
      discountAmount,
      advanceTaxAmount,
      netAmount
    });

    const savedPurchaseReturn = await newPurchaseReturn.save();

    for (const purchase of purchases) {
      const addingItem = await AddingItem.findOne({ itemName: purchase.item });
      if (!addingItem) {
        throw new Error(`Item not found: ${purchase.item}`);
      }
      await addingItem.updateStock(purchase.quantity);
    }

    res.status(201).json(savedPurchaseReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

export const createSales = async (req, res) => {
  const {
    items, totalAmount, discountPercent, discountPrice, netPrice, specialDiscountReceived,
    change, totalItems, user, doctorName, customerPhone, customerName, date, invoiceRef
  } = req.body;

  try {
    const newSale = new Sale({
      items, totalAmount, discountPercent, discountPrice, netPrice, specialDiscountReceived,
      change, totalItems, user, doctorName, customerPhone, customerName, date, invoiceRef
    });

    const savedSale = await newSale.save();

    for (const item of items) {
      const { code, quantity, name } = item;
      const addingItem = await AddingItem.findOne({ itemName: name });
      if (!addingItem) {
        throw new Error(`Item with code not found`);
      }

      if (addingItem.stock < quantity) {
        throw new Error(`Insufficient stock for item`);
      }
      addingItem.stock -= quantity;
      await addingItem.save();
    }

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createSaleReturn = async (req, res) => {
  const {
    items, totalAmount, discountPercent, discountPrice, netPrice, specialDiscountReceived,
    change, totalItems, user, doctorName, customerPhone, customerName, date, invoiceRef
  } = req.body;

  try {
    const newSale = new SaleReturn({
      items, totalAmount, discountPercent, discountPrice, netPrice, specialDiscountReceived,
      change, totalItems, user, doctorName, customerPhone, customerName, date, invoiceRef
    });

    const savedSale = await newSale.save();

    for (const item of items) {
      const { code, quantity } = item;
      const addingItem = await AddingItem.findOne({ itemCode: code });
      if (!addingItem) {
        throw new Error(`Item with code ${code} not found`);
      }

      if (addingItem.stock < quantity) {
        throw new Error(`Insufficient stock for item ${code}`);
      }
      addingItem.stock = quantity;
      await addingItem.save();
    }

    res.status(201).json(savedSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSaleReturn = async (req, res) => {
  try {

    const { from, invoiceref, customername, customerphone } = req.query;

    let query = {};

    if (from) {
      query.date = {
        $gte: new Date(from),
      };
    }

    if (invoiceref) {
      query.invoiceRef = invoiceref;
    }

    if (customername) {
      query.customerName = customername;
    }

    if (customerphone) {
      query.customerPhone = customerphone;
    }

    const sales = await SaleReturn.find(query);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { invoiceref } = req.params;

    const sale = await Sale.findOne({ invoiceRef: invoiceref });
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // for (const item of sale.items) {
    //   const addingItem = await AddingItem.findOne({ itemCode: item.code });
    //   if (!addingItem) {
    //     throw new Error(`Item with code ${item.code} not found`);
    //   }
    //   addingItem.stock += item.quantity;
    //   await addingItem.save();
    // }

    await Sale.deleteOne({ invoiceRef: invoiceref });
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};