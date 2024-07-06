import mongoose from "mongoose";

const cashVoucherSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  type: {
    type: String,
    enum: ['CashPayment', 'CashReceipt'],
  },
  amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now()
  }
});

const CashVoucher = mongoose.model('CashVoucher', cashVoucherSchema);
export default CashVoucher;
