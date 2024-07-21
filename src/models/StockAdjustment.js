import mongoose from 'mongoose';
const { Schema } = mongoose;

const StockAdjustmentSchema = new Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddingItem', required: true },
  previousStock: { type: Number,},
  newStock: { type: Number,},
  adjustment: { type: Number,},
  adjustmentType: { type: String, enum: ['increase', 'decrease'],},
  adjustedAt: { type: Date, default: Date.now },
});

const StockAdjustment = mongoose.model('StockAdjustment', StockAdjustmentSchema);
export default StockAdjustment;
