import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PurchaseAddSchema = new Schema({
  supplier: { type: String },
  dateOfPurchase: { type: Date, default: Date.now },
  billNumber: { type: String },
  paymentMode: { type: String },
  purchases: [
    {
      item: { type: String },
      quantity: { type: Number },
      bonusQuantity: { type: Number },
      rate: { type: Number },
      total: { type: Number },
      quantityInPack: { type: Number },
      retail: { type: Number },
      pricePercentage: { type: Number },
      discountPercentage: { type: Number },
      discountAmount: { type: Number },
      priceAfterDiscount: { type: Number },
      taxPercentage: { type: Number },
      taxAmount: { type: Number },
      taxAmount2: { type: Number },
      netAmount: { type: Number },
      batchNumber: { type: String },
      expiryDate: { type: Date },
      remarks: { type: String }
    }
  ],
  totalItems: { type: Number },
  billAmount: { type: Number },
  discountPercentage: { type: Number },
  discountAmount: { type: Number },
  advanceTaxAmount: { type: Number },
  netAmount: { type: Number }
});

const LooseItemSchema = new Schema({
  item: { type: String },
  retailPrice: { type: Number },
  looseQuantity: { type: Number, },
  rate: { type: Number },
  discountPercent: { type: Number },
  discountAmount: { type: Number },
  netAmount: { type: Number },
});

const PurchaseAddLooseSchema = new Schema({
  supplier: { type: String },
  dateOfPurchase: { type: Date, default: Date.now },
  billNumber: { type: String },
  paymentMode: { type: String },
  remarks: { type: String },
  looseItems: [LooseItemSchema],
});


const PurchaseReturnSchema = new Schema({
  supplier: { type: String },
  dateOfPurchase: { type: Date, default: Date.now },
  billNumber: { type: String },
  paymentMode: { type: String },
  remarks: { type: String },
  purchases: [
    {
      item: { type: String },
      quantity: { type: Number },
      bonusQuantity: { type: Number },
      rate: { type: Number },
      total: { type: Number },
      quantityInPack: { type: Number },
      retail: { type: Number },
      pricePercentage: { type: Number },
      discountPercentage: { type: Number },
      discountAmount: { type: Number },
      priceAfterDiscount: { type: Number },
      taxPercentage: { type: Number },
      taxAmount: { type: Number },
      netAmount: { type: Number },
      batchNumber: { type: String },
      expiryDate: { type: Date },
      remarks: { type: String }
    }
  ],
  totalItems: { type: Number },
  billAmount: { type: Number },
  discountPercentage: { type: Number },
  discountAmount: { type: Number },
  advanceTaxAmount: { type: Number },
  netAmount: { type: Number }
});

export default model('PurchaseAdd', PurchaseAddSchema);
export const PurchaseAddLoose = model('PurchaseAddLoose', PurchaseAddLooseSchema);
export const PurchaseReturn = model('PurchaseReturn', PurchaseReturnSchema);
