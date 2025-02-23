import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemMapSupplierSchema = new Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier'},
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'AddingItem', required: true },
  quantity: { type: Number, required: true },
});

export default model('ItemMapSupplier', ItemMapSupplierSchema);
