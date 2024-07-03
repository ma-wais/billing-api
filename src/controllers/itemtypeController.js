import ItemType from '../models/ItemType.js';

export const getItemTypes = async (req, res) => {
  try {
    const itemTypes = await ItemType.find();
    res.json(itemTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItemType = async (req, res) => {
  const { itemTypeName, itemTypeShortName, itemTypeActive, itemTypeRemarks } = req.body;

  const newItemType = new ItemType({
    itemTypeName,
    itemTypeShortName,
    itemTypeActive,
    itemTypeRemarks
  });

  try {
    const savedItemType = await newItemType.save();
    res.status(201).json(savedItemType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
