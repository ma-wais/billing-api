import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountType: {
        type: String,
        enum: ["Customer", "Supplier", "Expenses", "Trading"],
    },
    accountName: {
        type: String,
    },
    accountCode: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    address: {
        type: String
    },
    remarks: {
        type: String
    },
    openingDebit: {
        type: Number,
        default: 0
    },
    closingCredit: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});
// update account balance
accountSchema.methods.updateBalance = async function (money) {
    this.balance += money
    await this.save()
}
const Account = mongoose.model('Account', accountSchema);
export default Account