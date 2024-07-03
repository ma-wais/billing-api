import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  shopName: { type: String, required: true },
  owner: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  image: { type: String } // URL or path to the image
});

const Shop = mongoose.model('Shop', ShopSchema);
export default Shop;
