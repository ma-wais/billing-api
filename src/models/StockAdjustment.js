import mongoose from 'mongoose';
const { Schema } = mongoose;

const StockAdjustmentSchema = new Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddingItem', required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  adjustment: { type: Number, required: true },
  adjustmentType: { type: String, enum: ['increase', 'decrease'], required: true },
  adjustedAt: { type: Date, default: Date.now },
});

const StockAdjustment = mongoose.model('StockAdjustment', StockAdjustmentSchema);
export default StockAdjustment;
