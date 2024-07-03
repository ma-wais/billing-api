import PurchaseAdd, { PurchaseAddLoose, PurchaseReturn } from '../models/purchaseModels.js';
import AddingItem from '../models/Item.js';
import { Sale } from '../models/Sales.js';
import mongoose from 'mongoose';

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
        const { item, startDate, endDate, supplier, daysToExpire  } = req.query;

        let query = {};
        if (item) {
            query.item = item;
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

            query.expiryDate = {
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
export const createPurchaseAdd = async (req, res) => {
    const { supplier, dateOfPurchase, billNumber, paymentMode, purchases, totalItems, billAmount, discountPercentage, discountAmount, advanceTaxAmount, netAmount } = req.body;
  
    try {
      const newPurchaseAdd = new PurchaseAdd({
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
  
      const savedPurchaseAdd = await newPurchaseAdd.save();
  
      // Update stock for each purchase item
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
            const { code, quantity } = item;
            const addingItem = await AddingItem.findOne({ itemCode: code });
            if (!addingItem) {
                throw new Error(`Item with code ${code} not found`);
            }

            if (addingItem.stock < quantity) {
                throw new Error(`Insufficient stock for item ${code}`);
            }
            addingItem.stock -= quantity;
            await addingItem.save();
        }

        res.status(201).json(savedSale);
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
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  