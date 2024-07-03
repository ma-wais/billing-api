import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Schema for individual sale items
const SalesItemSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    unit: { type: String, required: true },
    salePrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    quantityPerPack: { type: Number, required: true }
});

const SaleSchema = new Schema({
    items: [SalesItemSchema],
    totalAmount: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    netPrice: { type: Number, required: true },
    specialDiscountReceived: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    totalItems: { type: Number, required: true },
    user: { type: String, required: true },
    company: String,
    doctorName: { type: String, required: true },
    customerPhone: String,
    customerName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    invoiceRef: { type: String, required: true }
});

export const SalesItem = mongoose.model('SalesItem', SalesItemSchema);
export const Sale = mongoose.model('Sale', SaleSchema);

