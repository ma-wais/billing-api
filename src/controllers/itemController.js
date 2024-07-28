import Account from '../models/Account.js';
import AddingItem from '../models/Item.js';
import StockAdjustment from '../models/StockAdjustment.js';

export const getItems = async (req, res) => {
  try {
    const { companyName, unit, maxMargin, supplier, itemName, stockType } = req.query;
    let query = {};

    if (companyName) {
      query.companyName = companyName;
    }

    if (unit) {
      query.unit = unit.toLowerCase();
    }

    if (maxMargin) {
      query.margin = { $lte: Number(maxMargin) };
    }

    if (supplier) {
      query.supplier = supplier;
    }

    if (itemName) {
      query.itemName = itemName;
    }

    if (stockType) {
      query.stockType = stockType;
    }

    const items = await AddingItem.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  console.log(req.body);
  const {
    itemCode, itemBarCode, itemName, itemType, companyName, unit, quantityInPack,
    retailPrice, minimumQuantity, maximumQuantity, status, itemRackNumber, narcotics,
    costPerPc, itemFormula, remarks, stock, supplierList
  } = req.body;

  const image = req.file?.path;
  const margin = retailPrice - costPerPc;

  let stockType = 'low';
  if (stock) {
    if (stock <= minimumQuantity) {
      stockType = 'low';
    } else if (stock >= maximumQuantity) {
      stockType = 'high';
    } else {
      stockType = 'normal';
    }
  }

  try {
    const suppliers = typeof supplierList === 'string' ? JSON.parse(supplierList) : supplierList;

    const supplierDocs = await Account.find({ accountName: { $in: suppliers.map(s => s.name) } });

    const supplierArray = supplierDocs.map(supplier => {
      const supplierInfo = suppliers.find(s => s.name === supplier.accountName);
      return { account: supplier._id, remarks: supplierInfo.remarks };
    });

    const newItem = new AddingItem({
      itemCode,
      itemBarCode,
      itemName,
      itemType,
      companyName,
      unit,
      quantityInPack,
      retailPrice,
      margin,
      minimumQuantity,
      maximumQuantity,
      status,
      itemRackNumber,
      narcotics,
      costPerPc,
      itemFormula,
      remarks,
      image,
      stock,
      stockType,
      supplier: supplierArray
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(400).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  console.log(updates);

  try {
    if (updates.stock !== undefined || updates.minimumQuantity !== undefined || updates.maximumQuantity !== undefined) {
      const item = await AddingItem.findById(id);
      const previousStock = item.stock;
      const newStock = updates.stock !== undefined ? updates.stock : item.stock;
      const minimumQuantity = updates.minimumQuantity !== undefined ? updates.minimumQuantity : item.minimumQuantity;
      const maximumQuantity = updates.maximumQuantity !== undefined ? updates.maximumQuantity : item.maximumQuantity;

      if (newStock <= minimumQuantity) {
        updates.stockType = 'low';
      } else if (newStock >= maximumQuantity) {
        updates.stockType = 'high';
      } else {
        updates.stockType = 'normal';
      }

      if (updates.stock !== undefined) {
        const adjustment = newStock - previousStock;
        const adjustmentType = adjustment > 0 ? 'increase' : 'decrease';
        const stockAdjustment = new StockAdjustment({
          itemId: id,
          previousStock,
          newStock,
          adjustment,
          adjustmentType,
        });
        await stockAdjustment.save();
      }
    }

    const updatedItem = await AddingItem.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItemFormula = async (req, res) => {
  const { id } = req.params;
  const { itemFormula } = req.body;

  try {
    const updatedItem = await AddingItem.findByIdAndUpdate(id, { itemFormula }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getStockAdjustments = async (req, res) => {
  const { id } = req.params;
  try {
    const stockAdjustments = await StockAdjustment.find({ itemId: id }).sort({ adjustedAt: -1 });
    res.json(stockAdjustments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getStockAdjustmentsByDate = async (req, res) => {
  const { from, to, itemId } = req.query;

  let query = {};
  if (itemId) {
    query.itemId = itemId;
  }
  if (from) {
    query.adjustedAt = {
      ...query.adjustedAt,
      $gte: new Date(from),
    };
  }
  if (to) {
    query.adjustedAt = {
      ...query.adjustedAt,
      $lte: new Date(to),
    };
  }

  try {
    const stockAdjustments = await StockAdjustment.find(query)
      .populate('itemId', 'itemName unit stock retailPrice')
      .sort('adjustedAt');

    let balanceQty = 0;
    const formattedAdjustments = stockAdjustments.map(adjustment => {
      const qtyIn = adjustment.adjustmentType === 'increase' ? adjustment.adjustment : 0;
      const qtyOut = adjustment.adjustmentType === 'decrease' ? adjustment.adjustment : 0;
      balanceQty += qtyIn - qtyOut;

      return {
        date: adjustment.adjustedAt,
        type: adjustment.adjustmentType,
        narration: `Stock ${adjustment.adjustmentType}d`,
        qtyIn,
        qtyOut,
        balanceQty,
        item: adjustment.itemId // Include the populated item details
      };
    });

    res.json(formattedAdjustments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};