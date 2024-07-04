import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SalesItemSchema = new Schema({
    name: { type: String},
    code: { type: String},
    unit: { type: String},
    salePrice: { type: Number},
    quantity: { type: Number},
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    stock: { type: Number},
    quantityPerPack: { type: Number},
    value: { type: Number},
    pricePercentage: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
});

const SaleSchema = new Schema({
    items: [SalesItemSchema],
    totalAmount: { type: Number,},
    discountPercent: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    netPrice: { type: Number, },
    specialDiscountReceived: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    totalItems: { type: Number, },
    user: { type: String, },
    doctorName: { type: String,},
    company: String,
    customerPhone: String,
    customerName: { type: String},
    date: { type: Date, default: Date.now },
    invoiceRef: { type: String},
    totalCost: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 }
});

const SalesReturnItemSchema = new Schema({
    name: { type: String},
    code: { type: String},
    unit: { type: String},
    salePrice: { type: Number},
    quantity: { type: Number},
    discount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    stock: { type: Number},
    quantityPerPack: { type: Number},
    value: { type: Number},
    pricePercentage: { type: Number, default: 0 },
});

const SaleReturnSchema = new Schema({
    items: [SalesReturnItemSchema],
    totalAmount: { type: Number,},
    discountPercent: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    netPrice: { type: Number, },
    specialDiscountReceived: { type: Number, default: 0 },
    change: { type: Number, default: 0 },
    totalItems: { type: Number, },
    user: { type: String, },
    doctorName: { type: String,},
    company: String,
    customerPhone: String,
    customerName: { type: String},
    date: { type: Date, default: Date.now },
    invoiceRef: { type: String}
});

// export const SalesItem = mongoose.model('SalesItem', SalesItemSchema);
export const Sale = mongoose.model('Sale', SaleSchema);
// export const SalesReturnItem = mongoose.model('SalesReturnItem', SalesReturnItemSchema);
export const SaleReturn = mongoose.model('SaleReturn', SaleReturnSchema);

