import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  shopName: { type: String, required: true },
  owner: { type: String,},
  address: { type: String,},
  phoneNumber: { type: String, },
  image: { type: String }
});

const Shop = mongoose.model('Shop', ShopSchema);
export default Shop;
