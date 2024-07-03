import  mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  companyName: String,
  shortName: String,
  code: String,
  phoneNumber: String,
  email: String,
  address: String,
  status: String,
  remarks: { type: String }
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;