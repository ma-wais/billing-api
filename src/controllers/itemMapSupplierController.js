import ItemMapSupplier from '../models/ItemMapSupplier.js';

export const getItemMapSuppliers = async (req, res) => {
  try {
    const itemMapSuppliers = await ItemMapSupplier.find();
    res.json(itemMapSuppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItemMapSupplier = async (req, res) => {
  const { supplierName, item, quantity } = req.body;

  const newItemMapSupplier = new ItemMapSupplier({
    supplierName,
    item,
    quantity
  });

  try {
    const savedItemMapSupplier = await newItemMapSupplier.save();
    res.status(201).json(savedItemMapSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMaxQuantityBySupplier = async (req, res) => {
  const { supplierName, item, newMaxQuantity } = req.body;

  try {
    const updatedItemMapSupplier = await ItemMapSupplier.findOneAndUpdate(
      { supplierName, item },
      { quantity: newMaxQuantity },
      { new: true }
    );
    res.json(updatedItemMapSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
