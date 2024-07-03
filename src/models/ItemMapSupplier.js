import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemMapSupplierSchema = new Schema({
  supplierName: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true }
});

export default model('ItemMapSupplier', ItemMapSupplierSchema);
