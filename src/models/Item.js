import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AddingItemSchema = new Schema({
  itemCode: { type: String },
  itemBarCode: { type: String },
  itemName: { type: String },
  itemType: { type: String },
  companyName: { type: String },
  unit: { type: String },
  stock: { type: Number, default: 0 },
  physicalStock: { type: Number, default: 0 },
  stockType: { type: String, enum: ['high', 'low', 'normal'], default: 'low' },
  quantityInPack: { type: Number },
  retailPrice: { type: Number },
  margin: { type: Number },
  minimumQuantity: { type: Number },
  maximumQuantity: { type: Number },
  status: { type: String },
  itemRackNumber: { type: String },
  narcotics: { type: Boolean },
  costPerPc: { type: Number },
  itemFormula: { type: String },
  remarks: { type: String },
  supplier: [{
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    remarks: { type: String }
  }],  image: { type: String }
});

AddingItemSchema.methods.updateStock = async function (quantityChange) {
  this.stock += quantityChange;
  await this.save();
};

export default model('AddingItem', AddingItemSchema);
