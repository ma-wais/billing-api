import Shop from '../models/Shop.js';

export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShop = async (req, res) => {
  const { shopName, owner, address, phoneNumber } = req.body;
  const image = req.file?.path;

  if (!image) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  const newShop = new Shop({
    shopName,
    owner,
    address,
    phoneNumber,
    image,
  });

  try {
    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
