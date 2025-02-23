import ItemMapSupplier from "../models/ItemMapSupplier.js";
import AddingItem from "../models/Item.js";

export const getItemMapSuppliers = async (req, res) => {
  try {
    const itemMapSuppliers = await ItemMapSupplier.find();
    res.json(itemMapSuppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItemMapSupplier = async (req, res) => {
  const { supplier, item, quantity } = req.body;

  try {
    const addingItem = await AddingItem.findById(item);
    if (!addingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    await addingItem.updateStock(quantity);

    const newItemMapSupplier = new ItemMapSupplier({
      supplier,
      item,
      quantity,
    });

    const savedItemMapSupplier = await newItemMapSupplier.save();
    res.status(201).json(savedItemMapSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMaxQuantityBySupplier = async (req, res) => {
  const { supplier, item, newMaxQuantity } = req.body;

  try {
    const updatedItemMapSupplier = await ItemMapSupplier.findOneAndUpdate(
      { supplier, item },
      { quantity: newMaxQuantity },
      { new: true }
    );
    res.json(updatedItemMapSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
