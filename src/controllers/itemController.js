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
      query.unit = unit;
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
  const { itemCode, itemBarCode, itemName, itemType, companyName, unit, quantityInPack, retailPrice, minimumQuantity, maximumQuantity,
     status, itemRackNumber, narcotics, costPerPc, itemFormula, remarks, stock } = req.body;

  const image = req.file?.path;
  console.log (image);
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
    stockType
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

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
