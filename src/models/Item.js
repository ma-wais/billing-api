import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AddingItemSchema = new Schema({
  itemCode: { type: String, required: true },
  itemBarCode: { type: String, required: true },
  itemName: { type: String, required: true },
  itemType: { type: String, required: true },
  companyName: { type: String, required: true },
  unit: { type: String, required: true },
  stock: { type: Number, default: 0 },
  physicalStock: { type: Number, default: 0 },
  stockType: { type: String, enum: ['high', 'low', 'normal'], default: 'low' },
  quantityInPack: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  margin: { type: Number, required: true },
  minimumQuantity: { type: Number, required: true },
  maximumQuantity: { type: Number, required: true },
  status: { type: String, required: true },
  itemRackNumber: { type: String },
  narcotics: { type: Boolean, required: true },
  costPerPc: { type: Number, required: true },
  itemFormula: { type: String },
  remarks: { type: String },
  supplier: { type: String },
  image: { type: String }
});

AddingItemSchema.methods.updateStock = async function (quantityChange) {
  this.stock += quantityChange;
  await this.save();
};


export default model('AddingItem', AddingItemSchema);
